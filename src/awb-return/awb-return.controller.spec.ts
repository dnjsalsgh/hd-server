import { Test, TestingModule } from '@nestjs/testing';
import { AwbReturnController } from './awb-return.controller';
import { AwbReturnService } from './awb-return.service';

describe('AwbReturnController', () => {
  let controller: AwbReturnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwbReturnController],
      providers: [AwbReturnService],
    }).compile();

    controller = module.get<AwbReturnController>(AwbReturnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
