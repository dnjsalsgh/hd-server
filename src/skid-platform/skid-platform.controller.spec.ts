import { Test, TestingModule } from '@nestjs/testing';
import { SkidPlatformController } from './skid-platform.controller';
import { SkidPlatformService } from './skid-platform.service';

describe('SkidPlatformController', () => {
  let controller: SkidPlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkidPlatformController],
      providers: [SkidPlatformService],
    }).compile();

    controller = module.get<SkidPlatformController>(SkidPlatformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
