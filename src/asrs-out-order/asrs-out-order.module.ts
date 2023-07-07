import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { AsrsOutOrderController } from './asrs-out-order.controller';
import { AsrsOutOrderService } from './asrs-out-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([AsrsOutOrder])],
  controllers: [AsrsOutOrderController],
  providers: [AsrsOutOrderService],
})
export class AsrsOutOrderModule {}
