import { PickType } from '@nestjs/swagger';
import { TempStorageHistory } from '../entities/temp-storage-history.entity';

export class CreateTempStorageHistoryDto extends PickType(TempStorageHistory, [
  'storageWorkOrder',
  'storage',
  'tempStorage',
  'awb',
]) {}
