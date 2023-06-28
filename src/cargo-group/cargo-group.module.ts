import { Module } from '@nestjs/common';
import { CargoGroupService } from './cargo-group.service';
import { CargoGroupController } from './cargo-group.controller';
import { CargoGroup } from './entities/cargo-group.entity';

@Module({
  imports: [CargoGroup],
  controllers: [CargoGroupController],
  providers: [CargoGroupService],
})
export class CargoGroupModule {}
