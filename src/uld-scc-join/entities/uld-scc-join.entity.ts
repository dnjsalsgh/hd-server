import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Scc } from '../../scc/entities/scc.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UldSccJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
    type: () => Uld,
  })
  @ManyToOne(() => Uld, (uld) => uld.uldSccJoin)
  uld: Relation<Uld>;

  @ApiProperty({
    example: 1,
    description: 'Scc FK',
    type: () => Scc,
  })
  @ManyToOne(() => Scc, (scc) => scc.uldSccJoin)
  scc: Relation<Scc>;
}
