import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CargoList {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: '미국',
    description: '생성출처',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @ApiProperty({
    example: '화물 등록 전',
    description: '상태',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드',
  })
  @Column({ nullable: false })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
