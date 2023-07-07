import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AsrsOutOrder } from '../../asrs-out-order/entities/asrs-out-order.entity';
import { Asrs } from '../../asrs/entities/asrs.entity';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';

@Entity()
export class SkidPlatformHistory {
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
    description: '자동창고 작업지시FK',
    type: () => AsrsOutOrder,
  })
  @ManyToOne(
    () => AsrsOutOrder,
    (asrsOutOrder) => asrsOutOrder.skidPlatformHistories,
  )
  asrsOutOrder: AsrsOutOrder;

  @ApiProperty({
    example: 1,
    description: '자동창고 FK',
    type: () => Asrs,
  })
  @ManyToOne(() => Asrs, (asrs) => asrs.skidPlatformHistories)
  asrs: Asrs;

  @ApiProperty({
    example: 1,
    description: '안착대 FK',
    type: () => SkidPlatform,
  })
  @ManyToOne(
    () => SkidPlatform,
    (skidPlatform) => skidPlatform.skidPlatformHistories,
  )
  skidPlatform: SkidPlatform;

  @ApiProperty({
    example: 1,
    description: '화물 FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.skidPlatformHistories)
  awb: Awb;
}
