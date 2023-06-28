import { Test, TestingModule } from '@nestjs/testing';
import { CargoGroupController } from './cargo-group.controller';
import { CargoGroupService } from './cargo-group.service';

describe('CargoGroupController', () => {
  let controller: CargoGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargoGroupController],
      providers: [CargoGroupService],
    }).compile();

    controller = module.get<CargoGroupController>(CargoGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
