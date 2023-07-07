import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Scc } from '../../scc/entities/scc.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Awb } from '../../awb/entities/awb.entity';

@Entity()
export class AwbSccJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.awbSccJoin)
  awb: Awb;

  @ApiProperty({
    example: 1,
    description: 'sccFK',
    type: () => Scc,
  })
  @ManyToOne(() => Scc, (scc) => scc.awbSccJoin)
  scc: Scc;
}
