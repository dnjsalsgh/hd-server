import { PartialType } from '@nestjs/mapped-types';
import { CreateAsrsOutOrderDto } from './create-asrs-out-order.dto';

export class UpdateAsrsOutOrderDto extends PartialType(CreateAsrsOutOrderDto) {}
