import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

const mockEventService = {
  create: jest.fn(),
};

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call EventService.create and return the result', async () => {
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

      const createdEvent = {
        id: '1',
        user: createEventDto.user,
        consents: createEventDto.consents,
      };
      mockEventService.create.mockResolvedValue(createdEvent);

      const result = await controller.create(createEventDto);
      expect(result).toEqual(createdEvent);
      expect(mockEventService.create).toHaveBeenCalledWith(createEventDto);
    });
  });
});
