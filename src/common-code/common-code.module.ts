import { Module } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CommonCodeController } from './common-code.controller';
import { CommonCode } from './entities/common-code.entity';

@Module({
  imports: [CommonCode],
  controllers: [CommonCodeController],
  providers: [CommonCodeService],
})
export class CommonCodeModule {}
