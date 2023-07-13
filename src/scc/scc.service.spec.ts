import { Test, TestingModule } from '@nestjs/testing';
import { SccService } from './scc.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Scc } from './entities/scc.entity';
import { Repository } from 'typeorm';
import { CreateSccDto } from './dto/create-scc.dto';

const mockSccRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SccService', () => {
  let service: SccService;
  let sccRepository: MockRepository<Scc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SccService,
        {
          provide: getRepositoryToken(Scc),
          useValue: mockSccRepository(),
        },
      ],
    }).compile();

    service = module.get<SccService>(SccService);
    sccRepository = module.get<MockRepository<Scc>>(getRepositoryToken(Scc));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockCreateSccDto: CreateSccDto = {
    code: '',
    name: '',
    score: 1,
    description: '',
    path: '',
  };

  it('should fail on exception', async () => {
    // postRepository.save() error 발생
    // sccRepository.save.mockRejectedValue('save error'); // 실패할꺼라고 가정한다.
    const result = await service.create(mockCreateSccDto);
    expect(result).toEqual(undefined); // 진짜 에러 발생했넴
  });

  it('should create scc', async () => {
    sccRepository.save.mockResolvedValue(mockCreateSccDto); // 성공할꺼라고 가정
    const result = await service.create(mockCreateSccDto);

    expect(sccRepository.save).toHaveBeenCalledTimes(1); // save가 1번 불러졌나?
    expect(sccRepository.save).toHaveBeenCalledWith(mockCreateSccDto); // 매개변수로 mockCreateSccDto가 주어졌나?

    expect(result).toEqual(mockCreateSccDto); // 이 create() method의 결과가 mockCreateSccDto와 똑같나?
  });

  it('should be find All', async () => {
    sccRepository.find.mockResolvedValue([]);
    const result = await service.findAll();
    expect(sccRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should fail on exception', async () => {
    sccRepository.find.mock;
    const result = await service.findAll();
    expect(result).toEqual('find error');
  });
});
