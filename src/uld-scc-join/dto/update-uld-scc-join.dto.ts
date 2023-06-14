import { PartialType } from '@nestjs/mapped-types';
import { CreateUldSccJoinDto } from './create-uld-scc-join.dto';

export class UpdateUldSccJoinDto extends PartialType(CreateUldSccJoinDto) {}
