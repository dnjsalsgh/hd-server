import { Test, TestingModule } from '@nestjs/testing';
import { CommonCodeController } from './common-code.controller';
import { CommonCodeService } from './common-code.service';

describe('CommonCodeController', () => {
  let controller: CommonCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonCodeController],
      providers: [CommonCodeService],
    }).compile();

    controller = module.get<CommonCodeController>(CommonCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
