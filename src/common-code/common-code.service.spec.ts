import { Test, TestingModule } from '@nestjs/testing';
import { CommonCodeService } from './common-code.service';

describe('CommonCodeService', () => {
  let service: CommonCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonCodeService],
    }).compile();

    service = module.get<CommonCodeService>(CommonCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
