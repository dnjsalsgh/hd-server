import {
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
import { IsNotEmpty } from 'class-validator';

@Entity()
export class AsrsHistory {
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
    description: '자동창고FK',
    type: () => Asrs,
  })
  @IsNotEmpty()
  @ManyToOne(() => Asrs, (asrs) => asrs.asrsHistories, { nullable: false })
  asrs: Relation<Asrs>;

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @IsNotEmpty()
  @ManyToOne(() => Awb, (awb) => awb.asrsHistories, { nullable: false })
  awb: Relation<Awb>;
}
