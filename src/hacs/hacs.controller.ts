import { Controller } from '@nestjs/common';
import { HacsService } from './hacs.service';

@Controller('hacs')
export class HacsController {
  constructor(private readonly hacsService: HacsService) {}
}
