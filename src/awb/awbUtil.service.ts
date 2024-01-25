import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { CreateAwbDto } from './dto/create-awb.dto';
import { Awb } from './entities/awb.entity';
import { orderByUtil } from '../lib/util/orderBy.util';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { DataSource, In, Repository, TypeORMError } from 'typeorm';
import { FileService } from '../file/file.service';
import { MqttService } from '../mqtt.service';
import { SccService } from '../scc/scc.service';
import { Scc } from '../scc/entities/scc.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AwbUtilService {
  constructor(
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
    private dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly mqttService: MqttService,
    private readonly sccService: SccService,
    private readonly redisService: RedisService,
  ) {}

  async settingRedis(barcode: string, separateNumber: number) {
    await this.redisService.set('barcode', barcode);
    await this.redisService.set('separateNumber', separateNumber.toString());
  }

  async getBarcode() {
    return this.redisService.get('barcode');
  }

  async getSeparateNumber() {
    return this.redisService.get('separateNumber');
  }

  // vms db에서 넘어온 데이터들을 awb에 넣기 위해 가공하는 메서드
  async prepareAwbDto(
    vms: Vms3D,
    vms2d: Vms2d,
    vmsAwbResult: VmsAwbResult,
    vmsAwbHistory: VmsAwbHistory,
  ) {
    const scheduleId = vmsAwbHistory?.FLIGHT_NUMBER
      ? await this.findSchedule(vmsAwbHistory.FLIGHT_NUMBER)
      : null;

    // TODO: vms의 데이터로 awb에 정보를 넣을 일이 있다면 여기서 넣어야 함
    const awbDto: Partial<CreateAwbDto> = {
      barcode: vmsAwbHistory.AWB_NUMBER,
      separateNumber: vmsAwbHistory.SEPARATION_NO,
      width: vmsAwbHistory.RESULT_WIDTH,
      length: vmsAwbHistory.RESULT_LENGTH,
      depth: vmsAwbHistory.RESULT_HEIGHT,
      weight: vmsAwbHistory.RESULT_WEIGHT,
      piece: vmsAwbHistory?.RESULT_PC ?? 1,
      state: 'invms',
      AirCraftSchedule: scheduleId,
      // gSkidOn: vmsAwbHistory?.G_SKID_ON === 'Y',
      awbTotalPiece: vmsAwbHistory?.RESULT_PC ?? 1, // 초기 전체 화물의 piece 수는 전체 피스수로 인식
      allAwbReceive: vmsAwbResult?.ALL_PART_RECEIVED === 'Y',
      receivedUser: vmsAwbHistory?.IN_USER_ID,
      receivedDate: vmsAwbHistory?.IN_DATE,
      waterVolume: vmsAwbHistory?.RESULT_WATER_VOLUME,
      squareVolume: vmsAwbHistory?.RESULT_CUBIC_VOLUME,
      modelPath: null,
      path: null,
      simulation: false,
      destination: vmsAwbResult?.ARRIVAL_CTY_CD, // 도착 공항 코드
      source: vmsAwbResult?.DEPARTURE_CTY_CD, // 출발 공항 코드
      parent: 0, // 처음 vms에서 생성되었으니 부모 0
    };

    // console.log('awbDto가 생성됨 = ', awbDto);

    // VWMS_AWB_HISTORY에서 체적 정보가 없을 때 반환 하는 로직
    // 100개를 긁어와서 누락된 화물 체크
    // [24.01.23] 100개를 긁어와서 팅기는게 아니라 다음 화물을 위해 null값 반환
    if (!awbDto.width) {
      console.log(`awbDto.width 없어서 실패`);
      return null;
      // throw new NotFoundException('체적 정보가 없습니다.');
    }

    // vms의 3D 파일을 저장함
    if (vms && vms.FILE_PATH) {
      try {
        const filePath = await this.fileUpload(vms);
        awbDto.modelPath = filePath;
      } catch (e) {}
    }

    // vms의 2D 파일을 저장함
    if (vms2d && vms2d.FILE_PATH) {
      try {
        const filePath2d = await this.fileUpload2d(vms2d);
        awbDto.path = filePath2d;
      } catch (e) {}
    }
    return awbDto;
  }

  async findExistingAwb(
    queryRunner,
    barcode: string,
    separateNumber: number,
  ): Promise<Awb> {
    const [existingAwb] = await queryRunner.manager.getRepository(Awb).find({
      where: { barcode: barcode, separateNumber: separateNumber },
      order: orderByUtil(null),
    });

    return existingAwb;
  }

  async findExistingAwbById(queryRunner, awbId: number): Promise<Awb> {
    const [existingAwb] = await queryRunner.manager.getRepository(Awb).find({
      where: { id: awbId },
      relations: { Scc: true },
      order: orderByUtil(null),
    });

    return existingAwb;
  }

  async findExistingAwbListById(queryRunner, awbId: number[]): Promise<Awb[]> {
    const existingAwb = await queryRunner.manager.getRepository(Awb).find({
      where: { id: In(awbId) },
      relations: { Scc: true },
      order: orderByUtil(null),
    });

    return existingAwb;
  }

  async updatePiece(queryRunner, awbId: number, piece: number): Promise<Awb> {
    const existingAwb = await queryRunner.manager
      .getRepository(Awb)
      .update(awbId, {
        awbTotalPiece: piece,
      });

    return existingAwb;
  }

  async findSccInAwb(queryRunner, awbId: number) {
    const [searchResult] = await queryRunner.manager.getRepository(Awb).find({
      where: { id: awbId },
      relations: {
        Scc: true,
      },
    });

    return searchResult;
  }

  async findSchedule(code: string): Promise<AircraftSchedule> {
    const [aircraftSchedule] = await this.aircraftScheduleRepository.find({
      where: { code: code },
      order: orderByUtil(null),
      take: 1,
    });
    return aircraftSchedule;
  }

  async updateAwb(queryRunner, id, awbDto): Promise<number> {
    await queryRunner.manager.getRepository(Awb).update(id, awbDto);
    return id;
  }

  async insertAwb(queryRunner, awbDto): Promise<Awb> {
    const insertedAwbResult = await queryRunner.manager
      .getRepository(Awb)
      .save(awbDto);
    return insertedAwbResult;
  }

  async connectAwbWithScc(queryRunner, sccData: VmsAwbResult, awbId: number) {
    if (!sccData?.SPCL_CGO_CD_INFO) {
      return;
    }

    const sccList = sccData.SPCL_CGO_CD_INFO.split(',');
    let sccResult = await this.sccService.findByNames(sccList);

    // CGO_NDS는 vms에서 자체생성한 scc
    if (sccData.CGO_NDS === 'Y') {
      const [ndsInfo] = await this.sccService.findByName('NDS');
      sccResult = [...sccResult, ndsInfo];
    }
    const joinParam = sccResult.map((item) => ({
      Awb: awbId,
      Scc: item.id,
    }));
    return queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
  }

  // mqtt 메시지를 보내는 캡슐화하는 위한 메서드
  async sendMqttMessage(existingAwb: any) {
    return this.mqttService.sendMqttMessage(`hyundai/vms1/create`, existingAwb);
  }

  // 에러를 반환하는데 쉽게 만들 메서드
  async handleError(queryRunner, error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    throw new TypeORMError(`rollback Working - ${error}`);
  }

  // 3D 파일을 저장하는 로직
  protected async fileUpload(vms: Vms3D) {
    const file = `Z:\\${vms.FILE_PATH}\\${vms.FILE_NAME}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms.AWB_NUMBER}_${vms.SEPARATION_NO}_${vms.FILE_NAME}`,
    );
    return fileResult;
  }

  // 2D 파일을 저장하는 로직
  protected async fileUpload2d(vms2d: Vms2d) {
    const file = `Z:\\${vms2d.FILE_PATH}\\${vms2d.FILE_NAME}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms2d.AWB_NUMBER}_${vms2d.SEPARATION_NO}_${vms2d.FILE_NAME}`,
    );
    return fileResult;
  }

  getQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  async findSccByCodeList(sccList: string[]) {
    return this.sccRepository.find({
      where: { code: In(sccList) },
    });
  }

  createAwbSccJoinParams(awbId: number, sccResult: Scc[]) {
    return sccResult.map((item) => ({
      Awb: awbId,
      Scc: item.id,
    }));
  }

  async saveAwbSccJoin(queryRunner, joinParam) {
    return queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
  }

  // scc 조회
  async findScc(awbResult) {
    return await this.sccRepository.find({
      where: { code: In(awbResult.scc as string[]) },
    });
  }

  // 부모 화물 상태 변경
  async changeParentCargoStatus(parentId, queryRunner) {
    await queryRunner.manager
      .getRepository(Awb)
      .update({ id: parentId }, { breakDown: true });
  }
}
