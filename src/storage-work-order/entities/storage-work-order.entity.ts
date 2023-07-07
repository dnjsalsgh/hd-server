import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Storage } from '../../storage/entities/storage.entity';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StorageWorkOrder {
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
  })
  @ManyToOne(() => Storage, (storage) => storage.storageWorkOrders)
  storage: Storage;

  @ApiProperty({
    example: 1,
    description: '안착대FK',
    type: () => TempStorage,
  })
  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.storageWorkOrders)
  tempStorage: TempStorage;

  @ApiProperty({
    example: 1,
    description: '화물FK',
  })
  @ManyToOne(() => Awb, (awb) => awb.storageWorkOrders)
  awb: Awb;

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.storageWorkOrder,
  )
  tempStorageHistories: TempStorageHistory[];
}
