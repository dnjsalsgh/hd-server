import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StorageHistory } from '../../storage-history/entities/storage-history.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  parent: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fullPath: string;

  @Column({ type: 'int', nullable: true })
  orderby: number;

  @Column({ type: 'double precision', nullable: true })
  x: number;

  @Column({ type: 'double precision', nullable: true })
  y: number;

  @Column({ type: 'double precision', nullable: true })
  z: number;

  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => StorageHistory, (storageHistory) => storageHistory.storage)
  storageHistories: StorageHistory[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.storage,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.storage,
  )
  tempStorageHistories: TempStorageHistory[];
}
