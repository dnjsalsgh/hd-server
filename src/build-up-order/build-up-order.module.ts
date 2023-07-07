import { Module } from '@nestjs/common';
import { BuildUpOrderService } from './build-up-order.service';
import { BuildUpOrderController } from './build-up-order.controller';
import { BuildUpOrder } from './entities/build-up-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BuildUpOrder])],
  controllers: [BuildUpOrderController],
  providers: [BuildUpOrderService],
})
export class BuildUpOrderModule {}
