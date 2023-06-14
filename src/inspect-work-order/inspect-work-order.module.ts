import { Module } from '@nestjs/common';
import { InspectWorkOrderService } from './inspect-work-order.service';
import { InspectWorkOrderController } from './inspect-work-order.controller';
import { InspectWorkOrder } from './entities/inspect-work-order.entity';

@Module({
  imports: [InspectWorkOrder],
  controllers: [InspectWorkOrderController],
  providers: [InspectWorkOrderService],
})
export class InspectWorkOrderModule {}
