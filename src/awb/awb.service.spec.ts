import { Test, TestingModule } from '@nestjs/testing';
import { AwbService } from './awb.service';

describe('CargoService', () => {
  let service: AwbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwbService],
    }).compile();

    service = module.get<AwbService>(AwbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
