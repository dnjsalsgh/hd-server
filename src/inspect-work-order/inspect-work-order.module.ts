import { Module } from '@nestjs/common';
import { InspectWorkOrderService } from './inspect-work-order.service';
import { InspectWorkOrderController } from './inspect-work-order.controller';
import { InspectWorkOrder } from './entities/inspect-work-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InspectWorkOrder])],
  controllers: [InspectWorkOrderController],
  providers: [InspectWorkOrderService],
})
export class InspectWorkOrderModule {}
