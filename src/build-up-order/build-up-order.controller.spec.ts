import { Test, TestingModule } from '@nestjs/testing';
import { BuildUpOrderController } from './build-up-order.controller';
import { BuildUpOrderService } from './build-up-order.service';

describe('BuildUpOrderController', () => {
  let controller: BuildUpOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildUpOrderController],
      providers: [BuildUpOrderService],
    }).compile();

    controller = module.get<BuildUpOrderController>(BuildUpOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
