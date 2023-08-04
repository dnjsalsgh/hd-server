import { Test, TestingModule } from '@nestjs/testing';
import { SkidPlatformHistoryController } from './skid-platform-history.controller';
import { SkidPlatformHistoryService } from './skid-platform-history.service';

describe('SkidPlatformHistoryController', () => {
  let controller: SkidPlatformHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkidPlatformHistoryController],
      providers: [SkidPlatformHistoryService],
    }).compile();

    controller = module.get<SkidPlatformHistoryController>(
      SkidPlatformHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
