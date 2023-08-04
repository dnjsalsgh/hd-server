import { Test, TestingModule } from '@nestjs/testing';
import { AsrsController } from './asrs.controller';
import { AsrsService } from './asrs.service';

describe('AsrsController', () => {
  let controller: AsrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsrsController],
      providers: [AsrsService],
    }).compile();

    controller = module.get<AsrsController>(AsrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
