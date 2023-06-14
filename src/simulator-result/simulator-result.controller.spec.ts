import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultController } from './simulator-result.controller';
import { SimulatorResultService } from './simulator-result.service';

describe('SimulatorResultController', () => {
  let controller: SimulatorResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorResultController],
      providers: [SimulatorResultService],
    }).compile();

    controller = module.get<SimulatorResultController>(SimulatorResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
