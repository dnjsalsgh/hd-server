import { PickType } from '@nestjs/swagger';
import { Asrs } from '../entities/asrs.entity';
export class UpdateAsrsDto {
  id: number;
  name: string;
  parent: number;
  level: number;
  fullPath: string;
  orderby: number;
}
