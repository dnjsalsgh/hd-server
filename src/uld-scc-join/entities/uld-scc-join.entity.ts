import { Column, Entity } from 'typeorm';

@Entity()
export class UldSccJoin {
  @Column('int', { primary: true, name: 'uld_id', nullable: false })
  Uld: number;

  @Column('int', { primary: true, name: 'scc_id', nullable: false })
  Scc: number;
}
