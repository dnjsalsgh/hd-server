import { Test, TestingModule } from '@nestjs/testing';
import { StackerDataController } from './stacker-data.controller';
import { StackerDataService } from './stacker-data.service';

describe('StackerDataController', () => {
  let controller: StackerDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StackerDataController],
      providers: [StackerDataService],
    }).compile();

    controller = module.get<StackerDataController>(StackerDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
