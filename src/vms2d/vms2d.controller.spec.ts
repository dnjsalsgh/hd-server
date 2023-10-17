import { Test, TestingModule } from '@nestjs/testing';
import { Vms2dController } from './vms2d.controller';
import { Vms2dService } from './vms2d.service';

describe('Vms2dController', () => {
  let controller: Vms2dController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Vms2dController],
      providers: [Vms2dService],
    }).compile();

    controller = module.get<Vms2dController>(Vms2dController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
