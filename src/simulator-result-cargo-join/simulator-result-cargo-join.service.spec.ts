import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';

describe('SimulatorResultCargoJoinService', () => {
  let service: SimulatorResultCargoJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatorResultCargoJoinService],
    }).compile();

    service = module.get<SimulatorResultCargoJoinService>(SimulatorResultCargoJoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
