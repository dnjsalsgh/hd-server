import { Column, Entity } from 'typeorm';

@Entity()
export class SimulatorResultAwbJoin {
  @Column('int', {
    name: 'simulator_result_id',
    primary: true,
    nullable: false,
  })
  SimulatorResult: number;

  @Column('int', { primary: true, name: 'awb_id', nullable: false })
  Awb: number;
}
