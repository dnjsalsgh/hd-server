import { Test, TestingModule } from '@nestjs/testing';
import { StackerDataService } from './stacker-data.service';

describe('StackerDataService', () => {
  let service: StackerDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StackerDataService],
    }).compile();

    service = module.get<StackerDataService>(StackerDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
