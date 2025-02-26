import { EventEntity } from 'src/modules/event/entities/event.entity';

export class ListUserDto {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly consents: EventEntity[]
  ) {}
}
