import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vms } from './entities/vms.entity';
import { VmsController } from './vms.controller';
import { VmsService } from './vms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vms])],
  controllers: [VmsController],
  providers: [VmsService],
})
export class VmsModule {}
