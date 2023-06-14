import { Test, TestingModule } from '@nestjs/testing';
import { TempStorageHistoryService } from './temp-storage-history.service';

describe('TempStorageHistoryService', () => {
  let service: TempStorageHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempStorageHistoryService],
    }).compile();

    service = module.get<TempStorageHistoryService>(TempStorageHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
