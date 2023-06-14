import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';

@Entity()
export class SimulatorHistory {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(
    () => SimulatorResult,
    (simulatorResult) => simulatorResult.simulatorHistories,
  )
  simulatorResult: SimulatorResult;

  @ManyToOne(() => Uld, (uld) => uld.simulatorHistories)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.simulatorHistories)
  cargo: Cargo;
}
