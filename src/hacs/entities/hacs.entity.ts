import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hacs {
  @ApiProperty({
    example: 1,
    description: '로봇번호',
  })
  @PrimaryColumn({ name: 'AMR_ID', type: 'varchar', nullable: false })
  public Amrld: number;

  @ApiProperty({
    example: new Date(),
    description: '데이터 업데이트 일자',
  })
  @Column({ nullable: true })
  public LogDT: string;

  @ApiProperty({
    example: 2,
    description: '로봇모드',
  })
  @Column({ nullable: true })
  public Mode?: number;
  @ApiProperty({
    example: 19440.0,
    description: 'x좌표',
  })
  @Column({ type: 'float', nullable: true })
  public X: number;
  @ApiProperty({
    example: 18220.2,
    description: 'y좌표',
  })
  @Column({ type: 'float', nullable: true })
  public Y: number;
  @ApiProperty({
    example: 30,
    description: '로봇헤딩',
  })
  @Column({ type: 'float', nullable: true })
  public H: number;

  @ApiProperty({
    example: 0.3,
    description: '현재속도(m/s)',
  })
  @Column({ nullable: true })
  public Speed: number;

  @ApiProperty({
    example: 1,
    description: '통신 연결상태',
  })
  @Column({ nullable: true })
  public Connected: number;

  @ApiProperty({
    example: 0,
    description: '마지막 에러의 에러코드',
  })
  @Column({ nullable: true })
  public ErrorCode: number;

  @ApiProperty({
    example: 'test error message',
    description: '에러메시지',
  })
  @Column({ nullable: true })
  public ErrorInfo: string;

  @ApiProperty({
    example: 'moving',
    description: '로봇의 현재 상태(이동, 리프팅 등)',
  })
  @Column({ nullable: true })
  public CurState: string;

  @ApiProperty({
    example: 0,
    description: '일시정지 상태(업=1, 다운=0)',
  })
  @Column({ nullable: true })
  public PauseState: number;

  @ApiProperty({
    example: 0,
    description: '리프트상태',
  })
  @Column({ nullable: true })
  public Loaded: number;

  @ApiProperty({
    example: 0,
    description:
      '턴테이블 상태(미감지 = 0, 12시 방향 = 1, 3시 방향 = 2, 6시 방향 = 3, 9시 방향 = 4)',
  })
  @Column({ nullable: true })
  public TurnTableStatus: number;

  @ApiProperty({
    example: 74,
    description: '배터리SOC',
  })
  @Column({ nullable: true })
  public SOC: number;

  @ApiProperty({
    example:
      '{Cmd":"GB","BCellVolt":39576,"BPackVolt":40000,"BPackCurrent":1000,"BChargeVolt":40000,"BTemperature":31,"Battery":81,"BError":0,"BWarning":0}',
    description: '배터리SOH',
  })
  @Column({ nullable: true })
  public SOH: string;

  @ApiProperty({
    example: 1,
    description: '파레트no',
  })
  @Column({ nullable: true })
  public PLTNo: number;

  @ApiProperty({
    example: null,
    description: '파레트 타입',
  })
  @Column({ nullable: true })
  public PLTType: string;

  @ApiProperty({
    example: '',
    description: '파트정보',
  })
  @Column({ nullable: true })
  public PartInfo: string;
  @ApiProperty({
    example: {
      Index: 0,
      Action: 8,
      ActionProperty: 0,
      Speed: 0.8,
      Angle: 0.0,
      Safety: [1, 1, 1, 1],
      LaneWidth: 0.0,
      X: 19440.0,
      Y: 4620.0,
      H: 0.0,
      Node: 840,
      Level: 0,
      LiftHeight: 0,
      PLTType: null,
      ConveyorAction: null,
    },
    description: '로봇경로정보(json타입)',
  })
  @Column({ nullable: true })
  public Paths: string;

  @ApiProperty({
    example: 1,
    description: '수행중인 작업번호',
  })
  @Column({ nullable: true })
  public JobId: number;

  @ApiProperty({
    example: 50,
    description: '미션 진척율',
  })
  @Column({ nullable: true })
  public Prog: number;

  @ApiProperty({
    example: new Date(),
    description: '도착예상시간',
  })
  @Column({ nullable: true })
  public DestTime: Date;

  @ApiProperty({
    example: new Date(),
    description: '미션할당시간',
  })
  @Column({ nullable: true })
  public CreationTime: Date;

  @ApiProperty({
    example: new Date(),
    description: '미션시작시간',
  })
  @Column({ nullable: true })
  public StartTime: Date;

  @ApiProperty({
    example: new Date(),
    description: '미션종료시간',
  })
  @Column({ nullable: true })
  public EndTime: Date;

  @ApiProperty({
    example: 19.0,
    description: '누적이동거리',
  })
  @Column({ nullable: true })
  public TravelDist: number;

  @ApiProperty({
    example: 13.0,
    description: '누적운행시간',
  })
  @Column({ nullable: true })
  public OprTime: number;

  @ApiProperty({
    example: 14.0,
    description: '누적정지시간',
  })
  @Column({ nullable: true })
  public StopTime: number;

  @ApiProperty({
    example: 74,
    description: '충전시작 배터리량',
  })
  @Column({ nullable: true })
  public StartBatteryLevel: number;

  @ApiProperty({
    example: true,
    description: '스키드 감지',
  })
  @Column({ nullable: true })
  public Skid: boolean;

  // @ApiProperty({
  //   example: 10.3,
  //   description: '충전기의 X좌표',
  // })
  // @Column({ type: 'float', nullable: true })
  // public ChargeX: number;
  //
  // @ApiProperty({
  //   example: 11.3,
  //   description: '충전기의 X좌표',
  // })
  // @Column({ type: 'float', nullable: true })
  // public ChargeY: number;
  //
  // @ApiProperty({
  //   example: 9.3,
  //   description: '충전기의 X좌표',
  // })
  // @Column({ type: 'float', nullable: true })
  // public ChargeZ: number;

  // @ApiProperty({
  //   example: '인입용',
  //   description: '인입용, 인출용 구분',
  // })
  // distinguish: string;
}
