import { Test, TestingModule } from '@nestjs/testing';
import { StorageHistoryService } from './storage-history.service';

describe('StorageHistoryService', () => {
  let service: StorageHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageHistoryService],
    }).compile();

    service = module.get<StorageHistoryService>(StorageHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
