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
import { Asrs } from '../../asrs/entities/asrs.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@Entity()
export class AsrsHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'in',
    description: '부모 창고의 id',
  })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false, length: 50, default: 0 })
  inOutType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '자동창고FK',
    type: () => Asrs,
  })
  @IsNotEmpty()
  @ManyToOne(() => Asrs, (asrs) => asrs.asrsHistories, { nullable: false })
  Asrs: Relation<Asrs>;

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @IsNotEmpty()
  @ManyToOne(() => Awb, (awb) => awb.asrsHistories, { nullable: false })
  Awb: Relation<Awb>;
}
