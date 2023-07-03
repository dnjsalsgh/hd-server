import { Module } from '@nestjs/common';
import { CargoGroupService } from './cargo-group.service';
import { CargoGroupController } from './cargo-group.controller';
import { CargoGroup } from './entities/cargo-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CargoGroup])],
  controllers: [CargoGroupController],
  providers: [CargoGroupService],
})
export class CargoGroupModule {}
