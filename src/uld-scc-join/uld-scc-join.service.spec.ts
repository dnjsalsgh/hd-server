import { Test, TestingModule } from '@nestjs/testing';
import { UldSccJoinService } from './uld-scc-join.service';

describe('UldSccJoinService', () => {
  let service: UldSccJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UldSccJoinService],
    }).compile();

    service = module.get<UldSccJoinService>(UldSccJoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
