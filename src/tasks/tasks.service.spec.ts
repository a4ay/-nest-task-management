import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  id: 'random',
  username: 'test',
  password: 'test',
  tasks: [],
};

const mockTask: Task = {
  id: 'random',
  description: 'random',
  status: TaskStatus.OPEN,
  title: 'random',
  user: mockUser,
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTaskRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls tasksService.getTasks and returns tasks', async () => {
      tasksRepository.getTasks.mockResolvedValue('somevalue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toMatch('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksService.getTaskById and returns a task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('random', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls tasksService.getTaskById and throws an error', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
