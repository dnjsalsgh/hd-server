import { Module } from '@nestjs/common';
import { BuildUpOrderService } from './build-up-order.service';
import { BuildUpOrderController } from './build-up-order.controller';
import { BuildUpOrder } from './entities/build-up-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UldHistory } from '../uld-history/entities/uld-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuildUpOrder, UldHistory])],
  controllers: [BuildUpOrderController],
  providers: [BuildUpOrderService],
})
export class BuildUpOrderModule {}
