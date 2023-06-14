import { Test, TestingModule } from '@nestjs/testing';
import { StorageWorkOrderController } from './storage-work-order.controller';
import { StorageWorkOrderService } from './storage-work-order.service';

describe('StorageWorkOrderController', () => {
  let controller: StorageWorkOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageWorkOrderController],
      providers: [StorageWorkOrderService],
    }).compile();

    controller = module.get<StorageWorkOrderController>(StorageWorkOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
