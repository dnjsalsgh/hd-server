import { Test, TestingModule } from '@nestjs/testing';
import { UldHistoryService } from './uld-history.service';

describe('UldHistoryService', () => {
  let service: UldHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UldHistoryService],
    }).compile();

    service = module.get<UldHistoryService>(UldHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
