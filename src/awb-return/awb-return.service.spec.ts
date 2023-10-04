import { Test, TestingModule } from '@nestjs/testing';
import { AwbReturnService } from './awb-return.service';

describe('AwbReturnService', () => {
  let service: AwbReturnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwbReturnService],
    }).compile();

    service = module.get<AwbReturnService>(AwbReturnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
