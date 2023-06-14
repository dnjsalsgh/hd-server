import { Test, TestingModule } from '@nestjs/testing';
import { SccController } from './scc.controller';
import { SccService } from './scc.service';

describe('SccController', () => {
  let controller: SccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SccController],
      providers: [SccService],
    }).compile();

    controller = module.get<SccController>(SccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
