import { NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';

const mockUserRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  softDelete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      const userEntity = new UserEntity();
      Object.assign(userEntity, createUserDto);

      mockUserRepository.save.mockResolvedValue(userEntity);

      const result = await service.create(createUserDto);
      expect(result).toEqual(userEntity);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userEntity);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user: UserEntity = {
        id: '1',
        email: 'test@example.com',
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne({ id: '1' });
      expect(result).toEqual(new ListUserDto(user.id, user.email, []));
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne({ id: '1' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      const user: UserEntity = {
        id: '1',
        email: 'test@example.com',
      } as UserEntity;
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockUserRepository.softDelete.mockResolvedValue(undefined);

      const result = await service.remove('1');
      expect(result).toEqual(user);
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
