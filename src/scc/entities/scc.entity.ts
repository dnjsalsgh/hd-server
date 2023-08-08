import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Awb } from '../../awb/entities/awb.entity';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
export class Scc {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Scc-001',
    description: 'scc의 고유코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @ApiProperty({
    example: 'Scc-001',
    description: 'scc의 이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
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

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: '/c/xx',
    description: '이미지 파일경로',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string;

  // [23-07-26] scc의 선적 불가능List를 db에 저장하는 요청으로 인해 만든 column
  @ApiProperty({
    example: ['RRY', 'AVI'],
    description: 'Scc 금지 목록',
  })
  @Column({
    type: 'simple-array', // 배열 타입으로 선언
    nullable: true, // null 허용 여부 (선택 사항)
    default: [], // 기본값 (선택 사항)
  })
  banList: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // @OneToMany(() => AwbSccJoin, (cargoSccJoin) => cargoSccJoin.Scc)
  // awbSccJoin: AwbSccJoin[];

  // @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.scc)
  // uldSccJoin: UldSccJoin[];

  @ManyToMany(() => Uld, (uld) => uld.Scc)
  Uld: Uld[];

  @ManyToMany(() => Awb, (awb) => awb.Scc)
  Awb: Awb[];
}

export const SccAttribute = {
  id: true,
  code: true,
  name: true,
  score: true,
  description: true,
  path: true,
  notTogetherList: true,
  createdAt: true,
};
