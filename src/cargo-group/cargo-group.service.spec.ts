import { Test, TestingModule } from '@nestjs/testing';
import { CargoGroupService } from './cargo-group.service';

describe('CargoGroupService', () => {
  let service: CargoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargoGroupService],
    }).compile();

    service = module.get<CargoGroupService>(CargoGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
