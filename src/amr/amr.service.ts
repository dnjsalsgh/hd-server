import { Injectable } from '@nestjs/common';
import { CreateAmrDto } from './dto/create-amr.dto';
import { UpdateAmrDto } from './dto/update-amr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from './entities/amr.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { AmrRawDto } from './dto/amr-raw.dto';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Awb } from '../awb/entities/awb.entity';
import { CreateAwbSccJoinDto } from '../awb-scc-join/dto/create-awb-scc-join.dto';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { CreateAmrChargerDto } from '../amr-charger/dto/create-amr-charger.dto';
import { CreateAmrChargeHistoryDto } from '../amr-charge-history/dto/create-amr-charge-history.dto';
import { CreateTimeTableDto } from '../time-table/dto/create-time-table.dto';
import { TimeTable } from '../time-table/entities/time-table.entity';

@Injectable()
export class AmrService {
  constructor(
    @InjectRepository(Amr) private readonly amrRepository: Repository<Amr>,
    @InjectRepository(AmrCharger)
    private readonly amrChargerRepository: Repository<AmrCharger>,
    @InjectRepository(AmrChargeHistory)
    private readonly amrChargeHistoryRepository: Repository<AmrChargeHistory>,
    private dataSource: DataSource,
  ) {}
  create(createAmrDto: CreateAmrDto) {
    return this.amrRepository.save(createAmrDto);
  }

  async createAmrByPlcData(body: AmrRawDto) {
    // 1. make params by MS-SQL DBMS
    const amrBody: CreateAmrDto = {
      name: body.Amrld.toString(),
      charging: body.PauseState === 1,
      // prcsCD: body.PrcsCD,
      // ACSMode: body.ACSMode === 1,
      // mode: body.Mode,
      // errorLevel: body.ErrorLevel,
      errorCode: body.ErrorCode.toString(),
      startTime: body.StartTime,
      endTime: body.EndTime,
      travelDist: body.TravelDist,
      oprTime: new Date(body.OprTime),
      stopTime: new Date(body.StopTime),
      startBatteryLevel: body.StartBatteryLevel,
      // lastBatteryLevel: body.LastBatteryLevel,
      simulation: true,
      logDT: new Date(body.LogDT),
    };

    // 충전중 판단을 위한 findOne
    const lastAmrByName = await this.amrRepository.findOne({
      where: { name: body.Amrld.toString() },
      order: { createdAt: 'DESC' },
    });
    const amrChargerBody: CreateAmrChargerDto = {
      name: body.Amrld.toString(),
      working: lastAmrByName.startBatteryLevel < body.SOC, // 마지막 amr의 배터리량과 현재 배터리량의 비교로 [충전중] 판단
      x: body.ChargeX, // 유니티에서 보여지는 amr의 x좌표
      y: body.ChargeY, // 유니티에서 보여지는 amr의 y좌표
      z: body.ChargeZ, // 유니티에서 보여지는 amr의 z좌표
    };

    const amrChargeHistoryBody: CreateAmrChargeHistoryDto = {
      chargeStart: body.StartTime,
      chargeEnd: body.EndTime,
      soc: body.SOC.toString(),
      soh: body.SOH.toString(),
      amr: null,
      amrCharger: null,
    };

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const amrResult = await queryRunner.manager
        .getRepository(Amr)
        .upsert(amrBody, ['name']);

      const amrChargerResult = await queryRunner.manager
        .getRepository(AmrCharger)
        .upsert(amrChargerBody, ['name']);

      // Amr 생성, amr충전 생성 될 시에만 이력 저장
      if (amrResult.identifiers[0].id && amrChargerResult.identifiers[0].id) {
        amrChargeHistoryBody.amr = amrResult.identifiers[0].id;
        amrChargeHistoryBody.amrCharger = amrChargerResult.identifiers[0].id;

        const amrChargeHistoryResult = await queryRunner.manager
          .getRepository(AmrChargeHistory)
          .save(amrChargeHistoryBody);
      }

      // 지속적으로 amr 생성되는 정보들 타임테이블에 저장
      const timeTableBody: CreateTimeTableDto = {
        data: {
          X: body.X, // 움직이는 amr의 x좌표
          Y: body.Y, // 움직이는 amr의 y좌표
          H: body.H,
          Speed: body.Speed,
          // CurrentNode: body.CurrentNode,
          // TargetNode: body.TargetNode,
          Connected: body.Connected,
          ErrorInfo: body.ErrorInfo,
          CurState: body.CurState,
          PauseState: body.PauseState,
          Loaded: body.Loaded,
          // MDir: body.MDir,
          TurnTableStatus: body.TurnTableStatus,
          PLTNo: body.PLTNo,
          PLTType: body.PLTType,
          // TransNo: body.TransNo,
          // OrderNo: body.OrderNo,
          // PartInfo: body.PartInfo,
          Paths: body.Paths,
          // GroupNo: body.GroupNo,
          MissionNo: body.MissionNo,
          // JobId: body.JobId,
          // ActionId: body.ActionId,
          Prog: body.Prog,
          // DestTime: body.DestTime,
          CreationTime: body.CreationTime,
          // AccuBattery: body.AccuBattery,
        },
        Amr: amrResult.identifiers[0].id,
      };
      await queryRunner.manager.getRepository(TimeTable).save(timeTableBody);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.amrRepository.find();
  }

  findOne(id: number) {
    return this.amrRepository.find({ where: { id: id } });
  }

  update(id: number, updateAmrDto: UpdateAmrDto) {
    return this.amrRepository.update(id, updateAmrDto);
  }

  remove(id: number) {
    return this.amrRepository.delete(id);
  }
}
