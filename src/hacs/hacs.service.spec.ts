import { Test, TestingModule } from '@nestjs/testing';
import { HacsService } from './hacs.service';

describe('HacsService', () => {
  let service: HacsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HacsService],
    }).compile();

    service = module.get<HacsService>(HacsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
