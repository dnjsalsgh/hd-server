import { Test, TestingModule } from '@nestjs/testing';
import { CargoSccJoinService } from './cargo-scc-join.service';

describe('CargoSccJoinService', () => {
  let service: CargoSccJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargoSccJoinService],
    }).compile();

    service = module.get<CargoSccJoinService>(CargoSccJoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
