import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Scc } from '../../scc/entities/scc.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Awb } from '../../awb/entities/awb.entity';

@Entity('awb_scc_join')
export class AwbSccJoin {
  @Column('int', { primary: true, name: 'awb_id', nullable: false })
  Awb: number;

  @Column('int', { primary: true, name: 'scc_id', nullable: false })
  Scc: number;

  // @ApiProperty({
  //   example: 1,
  //   description: '화물FK',
  //   type: () => Awb,
  // })
  // @ManyToOne(() => Awb, (awb) => awb.awbSccJoin)
  // Awb: Relation<Awb> | number;
  //
  // @ApiProperty({
  //   example: 1,
  //   description: 'sccFK',
  //   type: () => Scc,
  // })
  // @ManyToOne(() => Scc, (scc) => scc.awbSccJoin)
  // Scc: Relation<Scc> | Relation<Scc>[] | number;
}
