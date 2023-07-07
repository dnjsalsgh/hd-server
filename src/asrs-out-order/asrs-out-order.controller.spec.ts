import { Test, TestingModule } from '@nestjs/testing';
import { AsrsOutOrderController } from './asrs-work-order.controller';
import { AsrsOutOrderService } from './asrs-work-order.service';

describe('AsrsOutOrderController', () => {
  let controller: AsrsOutOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsrsOutOrderController],
      providers: [AsrsOutOrderService],
    }).compile();

    controller = module.get<AsrsOutOrderController>(AsrsOutOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
