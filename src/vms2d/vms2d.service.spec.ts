import { Test, TestingModule } from '@nestjs/testing';
import { Vms2dService } from './vms2d.service';

describe('Vms2dService', () => {
  let service: Vms2dService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Vms2dService],
    }).compile();

    service = module.get<Vms2dService>(Vms2dService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
