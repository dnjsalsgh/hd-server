import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CargoSccJoin } from '../../cargo-scc-join/entities/cargo-scc-join.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Scc {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'scc-001',
    description: 'scc의 고유코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @ApiProperty({
    example: 'scc-001',
    description: 'scc의 이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: 1,
    description: '점수',
  })
  @Column({ type: 'int', nullable: true })
  score: number;

  @ApiProperty({
    example: '상세설명',
    description: '상세설명',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @ApiProperty({
    example: '/c/xx',
    description: '이미지 파일경로',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => CargoSccJoin, (cargoSccJoin) => cargoSccJoin.scc)
  cargoSccJoin: CargoSccJoin[];

  @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.scc)
  uldSccJoin: UldSccJoin[];
}
