import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';

@Entity()
export class UldHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision', nullable: true })
  x: number;

  @Column({ type: 'double precision', nullable: true })
  y: number;

  @Column({ type: 'double precision', nullable: true })
  z: number;

  @Column({ type: 'int', nullable: true })
  pieceCount: number;

  @Column({ type: 'boolean', nullable: true })
  recommend: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  worker: string;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.uldHistories,
  )
  inspectWorkOrder: InspectWorkOrder;

  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.uldHistories)
  tempStorage: TempStorage;

  @ManyToOne(() => Uld, (uld) => uld.uldHistories)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.uldHistories)
  cargo: Cargo;
}
