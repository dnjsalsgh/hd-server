import { PartialType } from '@nestjs/mapped-types';
import { CreateTempStorageDto } from './create-temp-storage.dto';

export class UpdateTempStorageDto extends PartialType(CreateTempStorageDto) {}
