import { Test, TestingModule } from '@nestjs/testing';
import { TempStorageController } from './temp-storage.controller';
import { TempStorageService } from './temp-storage.service';

describe('TempStorageController', () => {
  let controller: TempStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempStorageController],
      providers: [TempStorageService],
    }).compile();

    controller = module.get<TempStorageController>(TempStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
