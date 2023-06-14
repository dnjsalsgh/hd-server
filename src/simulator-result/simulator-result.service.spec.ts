import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultService } from './simulator-result.service';

describe('SimulatorResultService', () => {
  let service: SimulatorResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatorResultService],
    }).compile();

    service = module.get<SimulatorResultService>(SimulatorResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
