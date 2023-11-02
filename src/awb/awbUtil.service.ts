import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AwbUtilService {
  constructor(
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    private dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly mqttService: MqttService,
    private readonly sccService: SccService,
  ) {}

  async prepareAwbDto(vms: Vms3D, vms2d: Vms2d) {
    const awbDto: Partial<CreateAwbDto> = {
      barcode: vms.AWB_NUMBER,
      separateNumber: vms.SEPARATION_NO,
      width: vms.WIDTH,
      length: vms.LENGTH,
      depth: vms.HEIGHT,
      weight: vms.WEIGHT,
      state: 'invms',
    };

    if (vms && vms.FILE_PATH) {
      try {
        const filePath = await this.fileUpload(vms);
        awbDto.modelPath = filePath;
      } catch (e) {}
    }

    if (vms2d && vms2d.FILE_PATH) {
      try {
        const filePath2d = await this.fileUpload2d(vms2d);
        awbDto.path = filePath2d;
      } catch (e) {}
    }

    return awbDto;
  }

  async findExistingAwb(queryRunner, barcode) {
    const [existingAwb] = await queryRunner.manager.getRepository(Awb).find({
      where: { barcode: barcode },
      order: orderByUtil(null),
    });

    return existingAwb;
  }

  async updateAwb(queryRunner, id, awbDto) {
    return queryRunner.manager.getRepository(Awb).update(id, awbDto);
  }

  async insertAwb(queryRunner, awbDto) {
    return queryRunner.manager.getRepository(Awb).save(awbDto);
  }

  async connectAwbWithScc(queryRunner, vms, existingAwb) {
    const sccResult = await this.sccService.findByNames(vms.Sccs.split(','));
    const joinParam = sccResult.map((item) => ({
      Awb: existingAwb.id,
      Scc: item.id,
    }));
    return queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
  }

  async sendMqttMessage(existingAwb) {
    return this.mqttService.sendMqttMessage(`hyundai/vms1/create`, existingAwb);
  }

  async handleError(queryRunner, error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    throw new TypeORMError(`rollback Working - ${error}`);
  }

  protected async fileUpload(vms: Vms3D) {
    const file = `${vms.FILE_PATH}/${vms.FILE_NAME}.${vms.FILE_EXTENSION}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms.FILE_NAME}.${vms.FILE_EXTENSION}`,
    );
    return fileResult;
  }

  protected async fileUpload2d(vms2d: Vms2d) {
    const file = `${vms2d.FILE_PATH}/${vms2d.FILE_NAME}.${vms2d.FILE_EXTENSION}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms2d.FILE_NAME}.${vms2d.FILE_EXTENSION}`,
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
}
