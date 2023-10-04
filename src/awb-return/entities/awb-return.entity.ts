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
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AwbReturn {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '반송사유',
    description: '반송사유',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Awb, (awb) => awb.AwbReturns)
  Awb?: Relation<Awb> | number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
