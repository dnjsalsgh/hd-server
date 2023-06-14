import { Test, TestingModule } from '@nestjs/testing';
import { AmrController } from './amr.controller';
import { AmrService } from './amr.service';

describe('AmrController', () => {
  let controller: AmrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmrController],
      providers: [AmrService],
    }).compile();

    controller = module.get<AmrController>(AmrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
