import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StorageHistory } from '../../storage-history/entities/storage-history.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@Entity()
export class Storage {
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
    example: 1,
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
  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => StorageHistory, (storageHistory) => storageHistory.storage)
  storageHistories: StorageHistory[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.storage,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.storage,
  )
  tempStorageHistories: TempStorageHistory[];
}
