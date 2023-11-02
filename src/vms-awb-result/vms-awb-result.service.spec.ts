import { Test, TestingModule } from '@nestjs/testing';
import { VmsAwbResultService } from './vms-awb-result.service';

describe('VmsAwbResultService', () => {
  let service: VmsAwbResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmsAwbResultService],
    }).compile();

    service = module.get<VmsAwbResultService>(VmsAwbResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
