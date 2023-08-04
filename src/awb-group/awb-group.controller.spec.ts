import { Test, TestingModule } from '@nestjs/testing';
import { AwbGroupController } from './awb-group.controller';
import { AwbGroupService } from './awb-group.service';

describe('CargoGroupController', () => {
  let controller: AwbGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwbGroupController],
      providers: [AwbGroupService],
    }).compile();

    controller = module.get<AwbGroupController>(AwbGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
