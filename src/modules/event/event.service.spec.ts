import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';

const mockEventRepository = {
  save: jest.fn(),
};

describe('EventService', () => {
  let service: EventService;
  let repository: Repository<EventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(EventEntity),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an event', async () => {
      const createEventDto: CreateEventDto = {
        user: {
          id: '8e3b1f52-0f01-4bb7-9145-047cd919b7c3',
        },
        consents: [
          {
            id: 'email_notifications',
            enabled: false,
          },
        ],
      };

      const eventEntity = new EventEntity();
      Object.assign(eventEntity, createEventDto.consents[0], {
        user: createEventDto.user,
      });

      mockEventRepository.save.mockResolvedValue(eventEntity);

      const result = await service.create(createEventDto);
      expect(result).toEqual(eventEntity);
      expect(mockEventRepository.save).toHaveBeenCalledWith(eventEntity);
    });
  });
});
