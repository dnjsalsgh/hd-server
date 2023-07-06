import { Module } from '@nestjs/common';
import { CargoListService } from './cargo-list.service';
import { CargoListController } from './cargo-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoList } from './entities/cargo-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CargoList])],
  controllers: [CargoListController],
  providers: [CargoListService],
})
export class CargoListModule {}
