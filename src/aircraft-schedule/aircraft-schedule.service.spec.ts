import { Test, TestingModule } from '@nestjs/testing';
import { AircraftScheduleService } from './aircraft-schedule.service';

describe('AircraftScheduleService', () => {
  let service: AircraftScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AircraftScheduleService],
    }).compile();

    service = module.get<AircraftScheduleService>(AircraftScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
