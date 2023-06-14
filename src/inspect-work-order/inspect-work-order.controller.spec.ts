import { Test, TestingModule } from '@nestjs/testing';
import { InspectWorkOrderController } from './inspect-work-order.controller';
import { InspectWorkOrderService } from './inspect-work-order.service';

describe('InspectWorkOrderController', () => {
  let controller: InspectWorkOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectWorkOrderController],
      providers: [InspectWorkOrderService],
    }).compile();

    controller = module.get<InspectWorkOrderController>(InspectWorkOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
