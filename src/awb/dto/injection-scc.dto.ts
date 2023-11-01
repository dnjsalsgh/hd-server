import { ApiProperty } from '@nestjs/swagger';

export class InjectionSccDto {
  @ApiProperty({
    example: ['GEN', 'EBM'],
    description: 'awb에 붙을 scc',
  })
  Sccs: string[];
}
