import { Test, TestingModule } from '@nestjs/testing';
import { AwbController } from './awb.controller';
import { AwbService } from './awb.service';

describe('CargoController', () => {
  let controller: AwbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwbController],
      providers: [AwbService],
    }).compile();

    controller = module.get<AwbController>(AwbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
