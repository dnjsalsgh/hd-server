import { Test, TestingModule } from '@nestjs/testing';
import { UldHistoryController } from './uld-history.controller';
import { UldHistoryService } from './uld-history.service';

describe('UldHistoryController', () => {
  let controller: UldHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UldHistoryController],
      providers: [UldHistoryService],
    }).compile();

    controller = module.get<UldHistoryController>(UldHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
