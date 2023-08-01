import { ApiProperty } from '@nestjs/swagger';

export class UldSccInjectionDto {
  @ApiProperty({
    example: '[1,2,3]',
    description: 'scc의 고유코드',
  })
  Scc: number[];
}
