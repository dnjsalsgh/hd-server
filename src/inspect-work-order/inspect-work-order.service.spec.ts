import { Test, TestingModule } from '@nestjs/testing';
import { InspectWorkOrderService } from './inspect-work-order.service';

describe('InspectWorkOrderService', () => {
  let service: InspectWorkOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectWorkOrderService],
    }).compile();

    service = module.get<InspectWorkOrderService>(InspectWorkOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
