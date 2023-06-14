import { Test, TestingModule } from '@nestjs/testing';
import { CargoSccJoinController } from './cargo-scc-join.controller';
import { CargoSccJoinService } from './cargo-scc-join.service';

describe('CargoSccJoinController', () => {
  let controller: CargoSccJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargoSccJoinController],
      providers: [CargoSccJoinService],
    }).compile();

    controller = module.get<CargoSccJoinController>(CargoSccJoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
