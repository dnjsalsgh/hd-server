import { Test, TestingModule } from '@nestjs/testing';
import { AmrChargeHistoryController } from './amr-charge-history.controller';
import { AmrChargeHistoryService } from './amr-charge-history.service';

describe('AmrChargeHistoryController', () => {
  let controller: AmrChargeHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmrChargeHistoryController],
      providers: [AmrChargeHistoryService],
    }).compile();

    controller = module.get<AmrChargeHistoryController>(AmrChargeHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
