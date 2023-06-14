import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';

@Entity()
export class InspectWorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  order: number;

  @Column({ type: 'double precision', nullable: true })
  x: number;

  @Column({ type: 'double precision', nullable: true })
  y: number;

  @Column({ type: 'double precision', nullable: true })
  z: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.inspectWorkOrders)
  tempStorage: TempStorage;

  @ManyToOne(() => Uld, (uld) => uld.inspectWorkOrders)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.inspectWorkOrders)
  cargo: Cargo;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];
}
