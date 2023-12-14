import { ApiProperty } from '@nestjs/swagger';

export class NasPathDto {
  @ApiProperty({
    example: 'D:\\고양이.png',
    description: '파일의 경로',
  })
  path: string;

  FILE_PATH?: string;
  FILE_NAME?: string;
  FILE_EXTENSION?:string
}
