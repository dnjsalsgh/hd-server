import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TempStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '안착대이름',
    description: '이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: 0,
    description: '부모 안착대',
  })
  @Column({ type: 'int', nullable: false })
  parent: number;

  @ApiProperty({
    example: 0,
    description: '안착대 트리 레벨',
  })
  @Column({ type: 'int', nullable: false })
  level: number;

  @ApiProperty({
    example: '안착대 경로',
    description: '안착대 경로',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  fullPath: string;

  @ApiProperty({
    example: 0,
    description: '순서',
  })
  @Column({ type: 'int', nullable: true })
  orderby: number;

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

  @ApiProperty({
    example: true,
    description: '시뮬레이션모드',
  })
  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.tempStorage,
  )
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.tempStorage,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.tempStorage,
  )
  tempStorageHistories: TempStorageHistory[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];
}
