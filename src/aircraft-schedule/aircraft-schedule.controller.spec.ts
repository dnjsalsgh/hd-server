import { Test, TestingModule } from '@nestjs/testing';
import { AircraftScheduleController } from './aircraft-schedule.controller';
import { AircraftScheduleService } from './aircraft-schedule.service';

describe('AircraftScheduleController', () => {
  let controller: AircraftScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AircraftScheduleController],
      providers: [AircraftScheduleService],
    }).compile();

    controller = module.get<AircraftScheduleController>(AircraftScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
