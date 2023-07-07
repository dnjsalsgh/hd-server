import { Test, TestingModule } from '@nestjs/testing';
import { AsrsService } from './asrs.service';

describe('AsrsService', () => {
  let service: AsrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsrsService],
    }).compile();

    service = module.get<AsrsService>(AsrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
