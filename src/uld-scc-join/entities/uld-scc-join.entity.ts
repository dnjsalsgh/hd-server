import { Column, Entity } from 'typeorm';

@Entity()
export class UldSccJoin {
  @Column('int', { primary: true, name: 'uld_id', nullable: false })
  Uld: number;

  @Column('int', { primary: true, name: 'scc_id', nullable: false })
  Scc: number;

  // @PrimaryGeneratedColumn()
  // id: number;
  // @Column({ type: 'date', nullable: false })
  // createdAt: Date;
  //
  // @Column({ type: 'date', nullable: false })
  // updatedAt: Date;
  //
  // @Column({ type: 'date', nullable: true })
  // deletedAt: Date;
  // @ApiProperty({
  //   example: 1,
  //   description: 'ULD FK',
  //   type: () => Uld,
  // })
  // @ManyToOne(() => Uld, (uld) => uld.uldSccJoin)
  // uld: Relation<Uld>;
  //
  // @ApiProperty({
  //   example: 1,
  //   description: 'Scc FK',
  //   type: () => Scc,
  // })
  // @ManyToOne(() => Scc, (scc) => scc.uldSccJoin)
  // scc: Relation<Scc>;
}
