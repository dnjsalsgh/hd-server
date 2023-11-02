import { Test, TestingModule } from '@nestjs/testing';
import { VmsAwbResultController } from './vms-awb-result.controller';
import { VmsAwbResultService } from './vms-awb-result.service';

describe('VmsAwbResultController', () => {
  let controller: VmsAwbResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VmsAwbResultController],
      providers: [VmsAwbResultService],
    }).compile();

    controller = module.get<VmsAwbResultController>(VmsAwbResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
