import { Test, TestingModule } from '@nestjs/testing';
import { SccController } from './scc.controller';
import { SccService } from './scc.service';
import { Scc } from './entities/scc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('SccController', () => {
  let controller: SccController;
  let service: SccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeORMMySqlTestingModule([Scc]),
        TypeOrmModule.forFeature([Scc]),
      ],
      controllers: [SccController],
      providers: [SccService],
    }).compile();

    controller = module.get<SccController>(SccController);
    service = module.get<SccService>(SccService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll', () => {
    const result = ['test'];
  });
});
