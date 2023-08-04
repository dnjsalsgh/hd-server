import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultAwbJoinService } from './simulator-result-awb-join.service';

describe('SimulatorResultCargoJoinService', () => {
  let service: SimulatorResultAwbJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatorResultAwbJoinService],
    }).compile();

    service = module.get<SimulatorResultAwbJoinService>(
      SimulatorResultAwbJoinService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
