import { Test, TestingModule } from '@nestjs/testing';
import { AsrsHistoryController } from './asrs-history.controller';
import { AsrsHistoryService } from './asrs-history.service';

describe('AsrsHistoryController', () => {
  let controller: AsrsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsrsHistoryController],
      providers: [AsrsHistoryService],
    }).compile();

    controller = module.get<AsrsHistoryController>(AsrsHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
