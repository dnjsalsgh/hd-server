import { Test, TestingModule } from '@nestjs/testing';
import { CargoListService } from './cargo-list.service';

describe('CargoListService', () => {
  let service: CargoListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargoListService],
    }).compile();

    service = module.get<CargoListService>(CargoListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
