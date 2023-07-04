import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { Scc } from '../../scc/entities/scc.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CargoSccJoin {
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
    description: '화물FK',
  })
  @ManyToOne(() => Cargo, (cargo) => cargo.cargoSccJoin)
  cargo: Cargo;

  @ApiProperty({
    example: 1,
    description: 'sccFK',
    type: () => Scc,
  })
  @ManyToOne(() => Scc, (scc) => scc.cargoSccJoin)
  scc: Scc;
}
