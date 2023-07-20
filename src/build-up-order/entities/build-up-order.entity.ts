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
import { Uld } from '../../uld/entities/uld.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';

@Entity()
@Unique(['Uld', 'Awb'])
export class BuildUpOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 0,
    description: '불출서열',
  })
  @Column({ type: 'int', nullable: true })
  order: number;

  @ApiProperty({
    example: 1.0,
    description: 'x좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  x: number;

  @ApiProperty({
    example: 1.0,
    description: 'y좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  y: number;

  @ApiProperty({
    example: 1.0,
    description: 'z좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  z: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '안착대',
    type: () => SkidPlatform,
  })
  @ManyToOne(() => SkidPlatform, (skidPlatform) => skidPlatform.buildUpOrders)
  SkidPlatform: Relation<SkidPlatform> | number;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
    type: () => Uld,
  })
  @ManyToOne(() => Uld, (uld) => uld.buildUpOrders)
  Uld: Relation<Uld> | number;

  @ApiProperty({
    example: 1,
    description: 'Awb FK',
    type: () => Awb,
  })
  @ManyToOne(() => Awb, (awb) => awb.BuildUpOrders)
  Awb: Relation<Awb> | number;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.BuildUpOrder)
  uldHistories: Relation<UldHistory[]> | number;
}
