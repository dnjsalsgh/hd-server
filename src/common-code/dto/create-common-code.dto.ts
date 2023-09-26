import { ApiProperty } from '@nestjs/swagger';

export class CreateCommonCodeDto {
  @ApiProperty({
    example: 'test',
    description: '공통코드 이름',
  })
  name: string;
  @ApiProperty({
    example: 'test',
    description: '코드',
  })
  code: string;

  @ApiProperty({
    example: 'test',
    description: '코드',
  })
  masterCode: string;

  @ApiProperty({
    example: '0',
    description: '트리의 레벨',
  })
  level?: number;

  @ApiProperty({
    example: '0',
    description: '트리의 정렬기준',
  })
  orderby?: number;

  @ApiProperty({
    example: 'test',
    description: '트리의 타입',
  })
  type?: string;

  @ApiProperty({
    example: 'test',
    description: '상세설명',
  })
  description?: string;
}
