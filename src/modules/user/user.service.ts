import { EventEntity } from '../event/entities/event.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UserEntity } from './entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  create(createUserDto: CreateUserDto) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, createUserDto as UserEntity);

    return this.userRepository.save(userEntity);
  }

  async findOne(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]
  ) {
    const user = await this.userRepository.findOneBy(where);

    if (user === null)
      throw new NotFoundException('User is invalid or non existent');

    return new ListUserDto(
      user.id,
      user.email,
      this.filterLastConsents(user.events)
    );
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User is invalid or non existent');
    }

    await this.userRepository.softDelete(user.id);

    return user;
  }

  private filterLastConsents(events?: EventEntity[]): EventEntity[] {
    if (!events?.length) return [];

    const latestStatusMap = new Map<string, EventEntity>();

    events.forEach((event) => {
      const existing = latestStatusMap.get(event.id);

      if (!existing || event.updatedAt > existing.updatedAt) {
        latestStatusMap.set(event.id, event);
      }
    });

    return Array.from(latestStatusMap.values());
  }
}
