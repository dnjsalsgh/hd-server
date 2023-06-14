import { Test, TestingModule } from '@nestjs/testing';
import { AmrDataService } from './amr-data.service';

describe('AmrDataService', () => {
  let service: AmrDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrDataService],
    }).compile();

    service = module.get<AmrDataService>(AmrDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
