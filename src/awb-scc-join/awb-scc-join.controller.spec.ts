import { Test, TestingModule } from '@nestjs/testing';
import { AwbSccJoinController } from './awb-scc-join.controller';
import { AwbSccJoinService } from './awb-scc-join.service';

describe('CargoSccJoinController', () => {
  let controller: AwbSccJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwbSccJoinController],
      providers: [AwbSccJoinService],
    }).compile();

    controller = module.get<AwbSccJoinController>(AwbSccJoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
