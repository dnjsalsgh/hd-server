import { Module } from '@nestjs/common';
import { AmrChargerService } from './amr-charger.service';
import { AmrChargerController } from './amr-charger.controller';
import { AmrCharger } from './entities/amr-charger.entity';

@Module({
  imports: [AmrCharger],
  controllers: [AmrChargerController],
  providers: [AmrChargerService],
})
export class AmrChargerModule {}
