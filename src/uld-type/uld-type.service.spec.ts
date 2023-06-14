import { Test, TestingModule } from '@nestjs/testing';
import { UldTypeService } from './uld-type.service';

describe('UldTypeService', () => {
  let service: UldTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UldTypeService],
    }).compile();

    service = module.get<UldTypeService>(UldTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
