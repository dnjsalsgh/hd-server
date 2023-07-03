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
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class InspectWorkOrder {
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

  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.inspectWorkOrders)
  tempStorage: TempStorage;

  @ManyToOne(() => Uld, (uld) => uld.inspectWorkOrders)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.inspectWorkOrders)
  cargo: Cargo;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];
}
