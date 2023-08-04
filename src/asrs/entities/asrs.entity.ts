import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AsrsHistory } from '../../asrs-history/entities/asrs-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { AsrsOutOrder } from '../../asrs-out-order/entities/asrs-out-order.entity';
import { SkidPlatformHistory } from '../../skid-platform-history/entities/skid-platform-history.entity';

@Entity()
export class Asrs {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'test',
    description: '창고 위치 이름',
  })
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    example: 0,
    description: '부모 창고의 id',
  })
  @IsNumber()
  @IsOptional()
  @Min(-1, { message: 'Value must be greater than -1' })
  @Column({ type: 'int', nullable: false, default: 0 })
  parent: number;

  @ApiProperty({
    example: 0,
    description: '창고 level',
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @ApiProperty({
    example: 'fullPath',
    description: '창고의 위치',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  fullPath: string;

  @ApiProperty({
    example: 0,
    description: '넣은 순서',
  })
  @Column({ type: 'int', nullable: true })
  orderby: number;

  @ApiProperty({
    example: 0,
    description: 'x좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  x: number;

  @ApiProperty({
    example: 0,
    description: 'y좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  y: number;

  @ApiProperty({
    example: 0,
    description: 'z좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  z: number;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드 확인',
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => AsrsHistory, (asrsHistory) => asrsHistory.Asrs)
  asrsHistories: AsrsHistory[];

  @OneToMany(() => AsrsOutOrder, (asrsOutOrder) => asrsOutOrder.Asrs)
  asrsOutOrders: AsrsOutOrder[];

  @OneToMany(
    () => SkidPlatformHistory,
    (skidPlatformHistory) => skidPlatformHistory.Asrs,
  )
  skidPlatformHistories: SkidPlatformHistory[];
}

export const AsrsAttribute = {
  id: true,
  name: true,
  parent: true,
  level: true,
  fullPath: true,
  orderby: true,
  x: true,
  y: true,
  z: true,
  simulation: true,
  createdAt: true,
};
