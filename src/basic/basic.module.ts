import { Module } from '@nestjs/common';
import { BasicService } from './basic.service';
import { BasicController } from './basic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basic } from './entities/basic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Basic])],
  controllers: [BasicController],
  providers: [BasicService],
})
export class BasicModule {}
