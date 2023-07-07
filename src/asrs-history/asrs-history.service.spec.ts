import { Test, TestingModule } from '@nestjs/testing';
import { AsrsHistoryService } from './asrs-history.service';

describe('AsrsHistoryService', () => {
  let service: AsrsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsrsHistoryService],
    }).compile();

    service = module.get<AsrsHistoryService>(AsrsHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
