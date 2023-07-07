import { Test, TestingModule } from '@nestjs/testing';
import { SkidPlatformHistoryService } from './skid-platform-history.service';

describe('SkidPlatformHistoryService', () => {
  let service: SkidPlatformHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkidPlatformHistoryService],
    }).compile();

    service = module.get<SkidPlatformHistoryService>(
      SkidPlatformHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
