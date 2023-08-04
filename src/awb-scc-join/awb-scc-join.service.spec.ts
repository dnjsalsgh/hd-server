import { Test, TestingModule } from '@nestjs/testing';
import { AwbSccJoinService } from './awb-scc-join.service';

describe('CargoSccJoinService', () => {
  let service: AwbSccJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwbSccJoinService],
    }).compile();

    service = module.get<AwbSccJoinService>(AwbSccJoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
