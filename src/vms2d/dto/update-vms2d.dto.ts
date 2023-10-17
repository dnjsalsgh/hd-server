import { PartialType } from '@nestjs/swagger';
import { CreateVms2dDto } from './create-vms2d.dto';

export class UpdateVms2dDto extends PartialType(CreateVms2dDto) {}
