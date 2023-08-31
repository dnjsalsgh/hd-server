import { Test, TestingModule } from '@nestjs/testing';
import { HacsController } from './hacs.controller';
import { HacsService } from './hacs.service';

describe('HacsController', () => {
  let controller: HacsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HacsController],
      providers: [HacsService],
    }).compile();

    controller = module.get<HacsController>(HacsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
