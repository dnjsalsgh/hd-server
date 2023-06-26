import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: true, description: '성공 여부' })
  result: boolean;

  @ApiProperty({ example: 200, description: 'http status code' })
  status: number;

  @ApiProperty({ example: '성공', description: '메세지' })
  message: string;

  @ApiProperty({ description: '실제 사용하는 데이터 전문' })
  data: T;
}
