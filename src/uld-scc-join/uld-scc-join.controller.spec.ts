import { Test, TestingModule } from '@nestjs/testing';
import { UldSccJoinController } from './uld-scc-join.controller';
import { UldSccJoinService } from './uld-scc-join.service';

describe('UldSccJoinController', () => {
  let controller: UldSccJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UldSccJoinController],
      providers: [UldSccJoinService],
    }).compile();

    controller = module.get<UldSccJoinController>(UldSccJoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
