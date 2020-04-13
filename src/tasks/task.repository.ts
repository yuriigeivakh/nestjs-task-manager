import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./dto/create-task-dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter-dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
        const { search, status } = filterDTO;
        const query = this.createQueryBuilder('task');

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        const tasks = query.getMany();

        return tasks;
    }

    async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const { title, description } = createTaskDTO;

        const task = new Task();
        task.description = description;
        task.title = title;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}