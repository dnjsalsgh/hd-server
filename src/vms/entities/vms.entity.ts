import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

@Entity()
export class Vms {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ type: 'nvarchar', length: 100, nullable: true })
  name: string;

  @ApiProperty({
    example: 1.0,
    description: '워터볼륨',
  })
  @Column({ type: 'float', nullable: true })
  waterVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '폭(x)',
  })
  @Column({ type: 'float', nullable: true })
  width: number;

  @ApiProperty({
    example: 1.0,
    description: '높이(y)',
  })
  @Column({ type: 'float', nullable: true })
  length: number;

  @ApiProperty({
    example: 1.0,
    description: '깊이(z)',
  })
  @Column({ type: 'float', nullable: true })
  depth: number;

  @ApiProperty({
    example: 1.0,
    description: '중량',
  })
  @Column({ type: 'float', nullable: true })
  weight: number;

  @ApiProperty({
    example: 1.0,
    description: '얼음무개',
  })
  @Column({ type: 'int', nullable: true })
  iceWeight: number;

  @ApiProperty({
    example: ['REG', 'GEN'],
    description: '얼음무개',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  Sccs: string;

  //
  // @ApiProperty({
  //   example: true,
  //   description: '정형성',
  // })
  // @Column({ type: 'bit', nullable: true })
  // isStructure: boolean;
  //
  // @ApiProperty({
  //   example: '010101',
  //   description: '바코드',
  // })
  // @Column({ type: 'nvarchar', length: 1000, nullable: true })
  // barcode: string;
  //
  // @ApiProperty({
  //   example: '미국',
  //   description: '목적지',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // destination: string;
  //
  // @ApiProperty({
  //   example: '한국',
  //   description: '생성출처',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // source: string;
  //
  // @ApiProperty({
  //   example: false,
  //   description: '해포여부 (true: 해포됨, false 해포안됨)',
  // })
  // @Column({ type: 'bit', nullable: true })
  // breakDown: boolean;
  //
  // @ApiProperty({
  //   example: 1,
  //   description: 'piece수 breakdown된 경우에만 데이터 있음',
  // })
  // @Column({ type: 'int', nullable: true })
  // piece: number;

  @ApiProperty({
    example: 'saved',
    description:
      '상태(예약미입고, 입고중, 창고대기, 불출예정, 이동중, uld 작업장 대기, ULD작업',
  })
  @IsString()
  @IsEnum([
    'saved',
    'invms',
    'inasrs',
    'register',
    'outasrs',
    'inskidplatform',
    'inuld',
  ])
  @Column({ type: 'nvarchar', length: 100, nullable: true })
  state: string;

  // @ApiProperty({
  //   example: 0,
  //   description: '해포된 화물의 부모, 추척하기 위함',
  // })
  // @Column({ type: 'int', nullable: true })
  // parent: number;

  @ApiProperty({
    example: '',
    description: '모델파일 경로',
  })
  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  modelPath: string;

  // @ApiProperty({
  //   example: true,
  //   description: '시뮬레이션 모드',
  // })
  // @Column({ type: 'bit', nullable: true })
  // simulation: boolean;
  //
  // // v1 피드백 반영 후 새로생긴 칼럼
  // @ApiProperty({
  //   example: 1.0,
  //   description: '데이터 용량',
  // })
  // @Column({ type: 'float', nullable: true })
  // dataCapacity: number;
  //
  // @ApiProperty({
  //   example: 'fly',
  //   description: '항공편',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // flight: string;
  //
  // @ApiProperty({
  //   example: '출발지',
  //   description: '출발지',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // from: string;
  //
  // @ApiProperty({
  //   example: '공항도착',
  //   description: '공항도착',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // airportArrival: string;

  // ========= v1 피드백 반영 후 새로생긴 칼럼 끝 =========

  // ============v0.2 추가=================
  // @ApiProperty({
  //   example: '/c/file/xxx',
  //   description: '이미지 경로',
  // })
  // @Column({ type: 'nvarchar', length: 100, nullable: true })
  // path: string;
  //
  // @ApiProperty({
  //   example: 1,
  //   description: '화물의 등장 빈도',
  // })
  // @Column({ type: 'int', nullable: true })
  // spawnRatio: number;
  //
  // @ApiProperty({
  //   example: '배송설명',
  //   description: '배송설명',
  // })
  // @Column({ type: 'nvarchar', length: 1000, nullable: true })
  // description: string;
  //
  // @ApiProperty({
  //   example: 'RM 코멘트',
  //   description: 'RM 코멘트',
  // })
  // @Column({ type: 'nvarchar', length: 1000, nullable: true })
  // rmComment: string;
  //
  // @ApiProperty({
  //   example: '2023-07-12',
  //   description: '로컬타임',
  // })
  // @Column({ type: 'datetime', nullable: true })
  // localTime: Date;
  //
  // @ApiProperty({
  //   example: 'AIR-001',
  //   description: '터미널 내에 화물이 현재 위치하고 있는 사항',
  // })
  // @Column({ type: 'nvarchar', length: 1000, nullable: true })
  // localInTerminal: string;
  // ============v0.2 추가 끝=================
  //
  // @Column({ type: 'nvarchar' })
  // scc: string;
  // @Column({ type: 'nvarchar' })
  // aircraftName: string;
  // @Column({ type: 'nvarchar' })
  // aircraftCode: string;
  // @Column({ type: 'nvarchar' })
  // aircraftInfo: string;
  // @Column({ type: 'bit' })
  // allow: boolean;
  // @Column({ type: 'bit' })
  // allowDryIce: boolean;
  //
  // @Column({ type: 'datetime' })
  // localDepartureTime: string;
  // @Column({ type: 'datetime' })
  // koreaArrivalTime: string;
  // @Column({ type: 'datetime' })
  // workStartTime: string;
  // @Column({ type: 'datetime' })
  // workCompleteTargetTime: string;
  // @Column({ type: 'datetime' })
  // koreaDepartureTime: string;
  // @Column({ type: 'datetime' })
  // localArrivalTime: string;
  // @Column({ type: 'nvarchar' })
  // waypoint: string;
  //
  // @Column({ type: 'nvarchar' })
  // departure: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
