import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Storage } from '../../storage/entities/storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StorageHistory {
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
    description: '자동창고FK',
    type: () => Storage,
  })
  @ManyToOne(() => Storage, (storage) => storage.storageHistories)
  storage: Storage;

  @ApiProperty({
    example: 1,
    description: '화물FK',
  })
  @ManyToOne(() => Cargo, (cargo) => cargo.storageHistories)
  cargo: Cargo;
}
