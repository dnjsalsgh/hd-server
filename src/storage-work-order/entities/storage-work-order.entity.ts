import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Storage } from '../../storage/entities/storage.entity';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';

@Entity()
export class StorageWorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  order: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Storage, (storage) => storage.storageWorkOrders)
  storage: Storage;

  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.storageWorkOrders)
  tempStorage: TempStorage;

  @ManyToOne(() => Cargo, (cargo) => cargo.storageWorkOrders)
  cargo: Cargo;

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.storageWorkOrder,
  )
  tempStorageHistories: TempStorageHistory[];
}
