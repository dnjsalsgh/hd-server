import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectWorkOrderDto } from './create-inspect-work-order.dto';

export class UpdateInspectWorkOrderDto extends PartialType(CreateInspectWorkOrderDto) {}
