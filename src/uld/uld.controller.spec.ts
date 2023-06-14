import { Test, TestingModule } from '@nestjs/testing';
import { UldController } from './uld.controller';
import { UldService } from './uld.service';

describe('UldController', () => {
  let controller: UldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UldController],
      providers: [UldService],
    }).compile();

    controller = module.get<UldController>(UldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
