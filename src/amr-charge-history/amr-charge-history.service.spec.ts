import { Test, TestingModule } from '@nestjs/testing';
import { AmrChargeHistoryService } from './amr-charge-history.service';

describe('AmrChargeHistoryService', () => {
  let service: AmrChargeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrChargeHistoryService],
    }).compile();

    service = module.get<AmrChargeHistoryService>(AmrChargeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
