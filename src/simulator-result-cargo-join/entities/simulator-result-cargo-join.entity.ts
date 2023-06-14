import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';

export class SimulatorResultCargoJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Uld, (uld) => uld.simulatorResultCargoJoin)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.simulatorResultCargoJoin)
  cargo: Cargo;
}
