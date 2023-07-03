import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { TempStorage } from '../../temp-storage/entities/temp-storage.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UldHistory {
  @PrimaryGeneratedColumn()
  id: number;

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
    example: 0,
    description: 'uld안의 피스수량, 해포화물인 경우에만 낱개수량 입력',
  })
  @Column({ type: 'int', nullable: true })
  pieceCount: number;

  @ApiProperty({
    example: true,
    description: '추천사용여부, (true:추천대로, false: 작업자 수동)',
  })
  @Column({ type: 'boolean', nullable: true })
  recommend: boolean;

  @ApiProperty({
    example: '작업자이름',
    description: '추천사용을 안했을 때만 입력',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  worker: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '작업자 작업지시FK',
  })
  @ManyToOne(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.uldHistories,
  )
  inspectWorkOrder: InspectWorkOrder;

  @ManyToOne(() => TempStorage, (tempStorage) => tempStorage.uldHistories)
  tempStorage: TempStorage;

  @ManyToOne(() => Uld, (uld) => uld.uldHistories)
  uld: Uld;

  @ManyToOne(() => Cargo, (cargo) => cargo.uldHistories)
  cargo: Cargo;
}
