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
@Unique(['inOutType', 'Awb', 'SkidPlatform', 'count', 'totalCount'])
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
    description: '안착대안 현재화물개수',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', nullable: false, default: 0 })
  count: number;

  @ApiProperty({
    example: 0,
    description: '안착대안 전체화물 개수',
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  totalCount: number;

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
