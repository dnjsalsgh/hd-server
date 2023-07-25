import { Test, TestingModule } from '@nestjs/testing';
import { AsrsOutOrderService } from './asrs-out-order.service';

describe('AsrsOutOrderService', () => {
  let service: AsrsOutOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsrsOutOrderService],
    }).compile();

    service = module.get<AsrsOutOrderService>(AsrsOutOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
