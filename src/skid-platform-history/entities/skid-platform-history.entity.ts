import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AsrsOutOrder } from '../../asrs-out-order/entities/asrs-out-order.entity';
import { Asrs } from '../../asrs/entities/asrs.entity';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
@Unique(['inOutType', 'Awb', 'SkidPlatform'])
export class SkidPlatformHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'in',
    description: '입, 출고 구분',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['in', 'out'])
  @Column({ type: 'varchar', nullable: false, length: 50, default: 0 })
  inOutType: string;

  @ApiProperty({
    example: 0,
    description: '창고안의 개수',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: false, default: 0 })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '자동창고 작업지시FK',
    type: () => AsrsOutOrder,
  })
  @ManyToOne(
    () => AsrsOutOrder,
    (asrsOutOrder) => asrsOutOrder.skidPlatformHistories,
  )
  AsrsOutOrder: Relation<AsrsOutOrder> | number;

  @ApiProperty({
    example: 1,
    description: '자동창고 FK',
    type: () => Asrs,
  })
  @ManyToOne(() => Asrs, (asrs) => asrs.skidPlatformHistories)
  Asrs: Relation<Asrs> | number;

  @ApiProperty({
    example: 1,
    description: '안착대 FK',
    type: () => SkidPlatform,
  })
  @ManyToOne(
    () => SkidPlatform,
    (skidPlatform) => skidPlatform.skidPlatformHistories,
  )
  SkidPlatform: Relation<SkidPlatform> | number;

  @ApiProperty({
    example: 1,
    description: '화물 FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.SkidPlatformHistories)
  Awb: Relation<Awb> | number;
}
