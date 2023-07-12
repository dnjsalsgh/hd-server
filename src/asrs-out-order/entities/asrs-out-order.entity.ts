import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Asrs } from '../../asrs/entities/asrs.entity';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../../skid-platform-history/entities/skid-platform-history.entity';

@Entity()
export class AsrsOutOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '불출서열',
  })
  @Column({ type: 'int', nullable: true })
  order: number;

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
  @ManyToOne(() => Asrs, (asrs) => asrs.asrsOutOrders)
  Asrs: Relation<Asrs>;

  @ApiProperty({
    example: 1,
    description: '안착대FK',
    type: () => SkidPlatform,
  })
  @ManyToOne(() => SkidPlatform, (skidPlatform) => skidPlatform.asrsOutOrders)
  SkidPlatform: Relation<SkidPlatform>;

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.asrsOutOrders)
  Awb: Relation<Awb>;

  @OneToMany(
    () => SkidPlatformHistory,
    (skidPlatformHistory) => skidPlatformHistory.asrsOutOrder,
  )
  skidPlatformHistories: Relation<SkidPlatformHistory[]>;
}
