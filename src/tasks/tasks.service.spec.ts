import { Test } from '@nestjs/testing';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

const mockUser = {
    username: 'testuser',
    id: 1,
};

describe('Tasks service', () => {
    let tasksService;
    let taskRepository;

    const task = {
        title: 'title',
        description: 'description',
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ]
        }).compile();

        tasksService = await module.get(TasksService);
        taskRepository = await module.get(TaskRepository);
    });

    describe('getTasks', () => {
        it('should get all tasks from task repository', async () => {
            const value = 'some value';
            taskRepository.getTasks.mockResolvedValue(value);
            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters = { status: TaskStatus.IN_PROGRESS, search: 'some' };
            const tasks = await tasksService.getTasks(filters, mockUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(tasks).toEqual(value);
        });
    });

    describe('getTaskById', () => {
        it('should taskRepository.findOne and retrieve and return the tasks', async () => {
            taskRepository.findOne.mockResolvedValue(task);
            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(task);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } });
        });

        it('should throw an error when task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
    
});