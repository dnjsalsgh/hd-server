import { Test, TestingModule } from '@nestjs/testing';
import { StorageHistoryController } from './storage-history.controller';
import { StorageHistoryService } from './storage-history.service';

describe('StorageHistoryController', () => {
  let controller: StorageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageHistoryController],
      providers: [StorageHistoryService],
    }).compile();

    controller = module.get<StorageHistoryController>(StorageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
