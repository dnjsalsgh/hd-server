import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Amr } from '../../amr/entities/amr.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '{ test: 1}',
    description: '이력데이터',
  })
  @Column({ type: 'jsonb' })
  data: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
    type: () => Uld,
  })
  @ManyToOne(() => Uld, (uld) => uld.timeTables)
  uld: Uld;

  @ApiProperty({
    example: 1,
    description: 'AMR FK',
    type: () => Amr,
  })
  @ManyToOne(() => Amr, (amr) => amr.timeTables)
  amr: Amr;

  @ApiProperty({
    example: 1,
    description: '화물 FK',
  })
  @ManyToOne(() => Cargo, (cargo) => cargo.timeTables)
  cargo: Cargo;
}
