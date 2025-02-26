import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockUserService = {
  create: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return ListUserDto', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      const user = { id: '1', email: 'test@example.com', events: [] };
      mockUserService.create.mockResolvedValue(user);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(new ListUserDto(user.id, user.email, []));
    });
  });

  describe('find', () => {
    it('should return a user if found', async () => {
      const user = new ListUserDto('1', 'test@example.com', []);
      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.find('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.find('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call remove and return result', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserService.remove.mockResolvedValue(user);

      const result = await controller.remove('1');
      expect(result).toEqual(user);
    });
  });
});
