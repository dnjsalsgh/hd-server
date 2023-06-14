import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';

@Entity()
export class TempStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: false })
  parent: number;

  @Column({ type: 'int', nullable: false })
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

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.tempStorage,
  )
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.tempStorage,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.tempStorage,
  )
  tempStorageHistories: TempStorageHistory[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];
}
