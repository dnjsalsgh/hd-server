import { Test, TestingModule } from '@nestjs/testing';
import { TempStorageHistoryController } from './temp-storage-history.controller';
import { TempStorageHistoryService } from './temp-storage-history.service';

describe('TempStorageHistoryController', () => {
  let controller: TempStorageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempStorageHistoryController],
      providers: [TempStorageHistoryService],
    }).compile();

    controller = module.get<TempStorageHistoryController>(TempStorageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
