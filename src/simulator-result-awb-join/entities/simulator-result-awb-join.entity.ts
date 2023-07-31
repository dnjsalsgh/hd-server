import { Column, Entity } from 'typeorm';

@Entity()
export class SimulatorResultAwbJoin {
  @Column('int', {
    name: 'simulator_result_id',
    nullable: false,
  })
  SimulatorResult: number;

  @Column('int', { primary: true, name: 'awb_id', nullable: false })
  Awb: number;

  // @PrimaryGeneratedColumn()
  // id: number;
  //
  // @CreateDateColumn()
  // createdAt: Date;
  //
  // @UpdateDateColumn()
  // updatedAt: Date;
  //
  // @DeleteDateColumn()
  // deletedAt: Date | null;
  //
  // @ManyToOne(
  //   () => SimulatorResult,
  //   (simulatorResult) => simulatorResult.simulatorResultAwbJoin,
  //   { nullable: false },
  // )
  // SimulatorResult: Relation<SimulatorResult> | number;
  //
  // @ManyToOne(() => Awb, (awb) => awb.srJoin, { nullable: false })
  // Awb: Relation<Awb> | number;
}
