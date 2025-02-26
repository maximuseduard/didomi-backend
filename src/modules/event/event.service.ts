import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  create(createEventDto: CreateEventDto) {
    const eventEntity = new EventEntity();

    for (const consent of createEventDto.consents) {
      Object.assign(eventEntity, {
        ...(consent as EventEntity),
        user: createEventDto.user,
      });
    }

    return this.eventRepository.save(eventEntity);
  }
}
