import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorHistoryController } from './simulator-history.controller';
import { SimulatorHistoryService } from './simulator-history.service';

describe('SimulatorHistoryController', () => {
  let controller: SimulatorHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorHistoryController],
      providers: [SimulatorHistoryService],
    }).compile();

    controller = module.get<SimulatorHistoryController>(SimulatorHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
