import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Asrs } from '../../asrs/entities/asrs.entity';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../../skid-platform-history/entities/skid-platform-history.entity';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
@Unique(['Asrs', 'Awb']) // 어떤 안착대로 가는지 모르기 때문에 skidplatform 유니크 제거
export class AsrsOutOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '불출서열',
  })
  @Column({ type: 'int', nullable: false })
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
  @ManyToOne(() => Asrs, (asrs) => asrs.asrsOutOrders, { nullable: false })
  Asrs: Relation<Asrs> | number;

  @ApiProperty({
    example: 1,
    description: '안착대FK',
    type: () => SkidPlatform,
  })
  @ManyToOne(() => SkidPlatform, (skidPlatform) => skidPlatform.asrsOutOrders, {
    nullable: true,
  })
  SkidPlatform: Relation<SkidPlatform> | number | null; // 어떤 안착대로 가는지 정해지지 않았기 때문에 null 허용

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.AsrsOutOrders, { nullable: false })
  Awb: Relation<Awb> | number;

  @ApiProperty({
    example: 1,
    description: 'UldFK',
    type: () => Uld,
  })
  @ManyToOne(() => Uld, (uld) => uld.AsrsOutOrders)
  Uld: Relation<Uld> | number;

  @OneToMany(
    () => SkidPlatformHistory,
    (skidPlatformHistory) => skidPlatformHistory.AsrsOutOrder,
  )
  skidPlatformHistories: Relation<SkidPlatformHistory[]>;
}

export const AsrsOutOrderAttribute = {
  id: true,
  order: true,
  createdAt: true,
};
