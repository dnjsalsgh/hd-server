import { PartialType } from '@nestjs/mapped-types';
import { CreateBuildUpOrderDto } from './create-build-up-order.dto';

export class UpdateBuildUpOrderDto extends PartialType(CreateBuildUpOrderDto) {}
