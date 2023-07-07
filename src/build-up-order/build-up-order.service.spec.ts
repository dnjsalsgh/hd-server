import { Test, TestingModule } from '@nestjs/testing';
import { BuildUpOrderService } from './build-up-order.service';

describe('BuildUpOrderService', () => {
  let service: BuildUpOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildUpOrderService],
    }).compile();

    service = module.get<BuildUpOrderService>(BuildUpOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
