import { Test, TestingModule } from '@nestjs/testing';
import { AmrDataController } from './amr-data.controller';
import { AmrDataService } from './amr-data.service';

describe('AmrDataController', () => {
  let controller: AmrDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmrDataController],
      providers: [AmrDataService],
    }).compile();

    controller = module.get<AmrDataController>(AmrDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
