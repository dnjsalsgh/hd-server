import { Test, TestingModule } from '@nestjs/testing';
import { VmsAwbHistoryController } from './vms-awb-history.controller';
import { VmsAwbHistoryService } from './vms-awb-history.service';

describe('VmsAwbHistoryController', () => {
  let controller: VmsAwbHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VmsAwbHistoryController],
      providers: [VmsAwbHistoryService],
    }).compile();

    controller = module.get<VmsAwbHistoryController>(VmsAwbHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
