import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { Storage } from '../../storage/entities/storage.entity';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TempStorageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '자동창고 작업지시FK',
  })
  @ManyToOne(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.tempStorageHistories,
  )
  storageWorkOrder: StorageWorkOrder;

  @ApiProperty({
    example: 1,
    description: '자동창고 FK',
  })
  @ManyToOne(() => Storage, (storage) => storage.tempStorageHistories)
  storage: Storage;

  @ApiProperty({
    example: 1,
    description: '안착대 FK',
  })
  @ManyToOne(
    () => TempStorage,
    (tempStorage) => tempStorage.tempStorageHistories,
  )
  tempStorage: TempStorage;

  @ApiProperty({
    example: 1,
    description: '화물 FK',
  })
  @ManyToOne(() => Cargo, (cargo) => cargo.tempStorageHistories)
  cargo: Cargo;
}
