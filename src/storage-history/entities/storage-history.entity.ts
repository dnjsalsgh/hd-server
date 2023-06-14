import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Storage } from '../../storage/entities/storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';

@Entity()
export class StorageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Storage, (storage) => storage.storageHistories)
  storage: Storage;

  @ManyToOne(() => Cargo, (cargo) => cargo.storageHistories)
  cargo: Cargo;
}
