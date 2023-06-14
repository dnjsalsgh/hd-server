import { Test, TestingModule } from '@nestjs/testing';
import { StorageWorkOrderService } from './storage-work-order.service';

describe('StorageWorkOrderService', () => {
  let service: StorageWorkOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageWorkOrderService],
    }).compile();

    service = module.get<StorageWorkOrderService>(StorageWorkOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
