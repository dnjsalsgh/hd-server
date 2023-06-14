import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorHistoryService } from './simulator-history.service';

describe('SimulatorHistoryService', () => {
  let service: SimulatorHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatorHistoryService],
    }).compile();

    service = module.get<SimulatorHistoryService>(SimulatorHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
