import { Test, TestingModule } from '@nestjs/testing';
import { CargoListController } from './cargo-list.controller';
import { CargoListService } from './cargo-list.service';

describe('CargoListController', () => {
  let controller: CargoListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargoListController],
      providers: [CargoListService],
    }).compile();

    controller = module.get<CargoListController>(CargoListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
