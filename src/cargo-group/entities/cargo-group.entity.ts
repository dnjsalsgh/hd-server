import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CargoGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물그룹이름',
    description: '화물그룹이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: '화물그룹code',
    description: '화물그룹코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Cargo, (cargo) => cargo.cargoGroup)
  cargos: Cargo[];
}
