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

  @ManyToOne(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.tempStorageHistories,
  )
  storageWorkOrder: StorageWorkOrder;

  @ManyToOne(() => Storage, (storage) => storage.tempStorageHistories)
  storage: Storage;

  @ManyToOne(
    () => TempStorage,
    (tempStorage) => tempStorage.tempStorageHistories,
  )
  tempStorage: TempStorage;

  @ManyToOne(() => Cargo, (cargo) => cargo.tempStorageHistories)
  cargo: Cargo;
}
