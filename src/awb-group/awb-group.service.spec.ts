import { Test, TestingModule } from '@nestjs/testing';
import { AwbGroupService } from './awb-group.service';

describe('CargoGroupService', () => {
  let service: AwbGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwbGroupService],
    }).compile();

    service = module.get<AwbGroupService>(AwbGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
