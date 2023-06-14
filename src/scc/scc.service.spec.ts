import { Test, TestingModule } from '@nestjs/testing';
import { SccService } from './scc.service';

describe('SccService', () => {
  let service: SccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SccService],
    }).compile();

    service = module.get<SccService>(SccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
