import { Test, TestingModule } from '@nestjs/testing';
import { UldTypeController } from './uld-type.controller';
import { UldTypeService } from './uld-type.service';

describe('UldTypeController', () => {
  let controller: UldTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UldTypeController],
      providers: [UldTypeService],
    }).compile();

    controller = module.get<UldTypeController>(UldTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
