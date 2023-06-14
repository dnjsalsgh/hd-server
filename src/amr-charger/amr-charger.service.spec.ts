import { Test, TestingModule } from '@nestjs/testing';
import { AmrChargerService } from './amr-charger.service';

describe('AmrChargerService', () => {
  let service: AmrChargerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrChargerService],
    }).compile();

    service = module.get<AmrChargerService>(AmrChargerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
