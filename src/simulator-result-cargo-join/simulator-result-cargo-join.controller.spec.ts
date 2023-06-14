import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultCargoJoinController } from './simulator-result-cargo-join.controller';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';

describe('SimulatorResultCargoJoinController', () => {
  let controller: SimulatorResultCargoJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorResultCargoJoinController],
      providers: [SimulatorResultCargoJoinService],
    }).compile();

    controller = module.get<SimulatorResultCargoJoinController>(SimulatorResultCargoJoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
