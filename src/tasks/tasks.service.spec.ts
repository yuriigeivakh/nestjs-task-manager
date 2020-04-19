import { Test } from '@nestjs/testing';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
});

const mockUser = {
    username: 'testuser',
};

describe('Tasks service', () => {
    let tasksService;
    let taskRepository;

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

    it('should getTasks from task repository', async () => {
        const value = 'some value';
        taskRepository.getTasks.mockResolvedValue(value);
        expect(taskRepository.getTasks).not.toHaveBeenCalled();

        const filters = { status: TaskStatus.IN_PROGRESS, search: 'some' };
        const tasks = await tasksService.getTasks(filters, mockUser);

        expect(taskRepository.getTasks).toHaveBeenCalled();
        expect(tasks).toEqual(value);
    });
});