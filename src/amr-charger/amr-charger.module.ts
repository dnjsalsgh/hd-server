import { Module } from '@nestjs/common';
import { AmrChargerService } from './amr-charger.service';
import { AmrChargerController } from './amr-charger.controller';
import { AmrCharger } from './entities/amr-charger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AmrCharger])],
  controllers: [AmrChargerController],
  providers: [AmrChargerService],
})
export class AmrChargerModule {}
