import { Column, Entity } from 'typeorm';

@Entity('awb_scc_join')
export class AwbSccJoin {
  @Column('int', { primary: true, name: 'awb_id', nullable: false })
  Awb: number;

  @Column('int', { primary: true, name: 'scc_id', nullable: false })
  Scc: number;
}
