import { Test, TestingModule } from '@nestjs/testing';
import { AmrChargerController } from './amr-charger.controller';
import { AmrChargerService } from './amr-charger.service';

describe('AmrChargerController', () => {
  let controller: AmrChargerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmrChargerController],
      providers: [AmrChargerService],
    }).compile();

    controller = module.get<AmrChargerController>(AmrChargerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
