import { Test, TestingModule } from '@nestjs/testing';
import { SkidPlatformService } from './skid-platform.service';

describe('SkidPlatformService', () => {
  let service: SkidPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkidPlatformService],
    }).compile();

    service = module.get<SkidPlatformService>(SkidPlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
