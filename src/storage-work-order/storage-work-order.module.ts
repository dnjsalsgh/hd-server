import { Module } from '@nestjs/common';
import { StorageWorkOrderService } from './storage-work-order.service';
import { StorageWorkOrderController } from './storage-work-order.controller';
import { StorageWorkOrder } from './entities/storage-work-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StorageWorkOrder])],
  controllers: [StorageWorkOrderController],
  providers: [StorageWorkOrderService],
})
export class StorageWorkOrderModule {}
