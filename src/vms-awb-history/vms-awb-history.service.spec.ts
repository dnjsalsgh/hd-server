import { Test, TestingModule } from '@nestjs/testing';
import { VmsAwbHistoryService } from './vms-awb-history.service';

describe('VmsAwbHistoryService', () => {
  let service: VmsAwbHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmsAwbHistoryService],
    }).compile();

    service = module.get<VmsAwbHistoryService>(VmsAwbHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
