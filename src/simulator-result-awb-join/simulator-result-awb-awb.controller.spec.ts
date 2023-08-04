import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultAwbJoinController } from './simulator-result-awb-join.controller';
import { SimulatorResultAwbJoinService } from './simulator-result-awb-join.service';

describe('SimulatorResultCargoJoinController', () => {
  let controller: SimulatorResultAwbJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorResultAwbJoinController],
      providers: [SimulatorResultAwbJoinService],
    }).compile();

    controller = module.get<SimulatorResultAwbJoinController>(
      SimulatorResultAwbJoinController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
