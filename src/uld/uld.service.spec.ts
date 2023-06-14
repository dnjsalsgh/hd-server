import { Test, TestingModule } from '@nestjs/testing';
import { UldService } from './uld.service';

describe('UldService', () => {
  let service: UldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UldService],
    }).compile();

    service = module.get<UldService>(UldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
