import { HttpException, Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { UserService } from './../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private userService: UserService,
    ) {}

    async createTask(name: string, userId: number, priority: number) {
        if (
            !this.checkData(name, 'string') ||
            !this.checkData(userId, 'number') ||
            !this.checkData(priority, 'number')
        ) {
            throw new HttpException('Invalid data', 400);
        }

        const task = await this.userService.getUserById(userId);
        if (!task) {
            throw new HttpException('User not found', 404);
        }

        const newTask = await this.addTask(name, userId, priority);
        if (!newTask) {
            throw new HttpException('Error adding task', 400);
        }

        return newTask;
    }

    async addTask(
        name: string,
        userId: number,
        priority: number,
    ): Promise<Task> {
        try {
            const task = this.taskRepository.create({ name, userId, priority });
            return this.taskRepository.save(task);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getTaskByName(name: string): Promise<Task> {
        try {
            return this.taskRepository.findOne({ where: { name } });
        } catch (error) {
            throw new Error(error);
        }
    }

    async fetchTaskByName(name: string) {
        if (!this.checkData(name, 'string')) {
            throw new HttpException('Invalid name', 400);
        }
        return this.getTaskByName(name);
    }

    async fetchTasksByUserId(userId: number) {
        if (!this.checkData(userId, 'number')) {
            throw new HttpException('Invalid userId', 400);
        }
        return this.getUserTasks(userId);
    }

    async getUserTasks(id: number): Promise<Task[]> {
        try {
            return this.taskRepository.find({ where: { id } });
        } catch (error) {
            throw new Error(error);
        }
    }

    async resetData(): Promise<void> {
        try {
            await this.taskRepository.clear();
        } catch (error) {
            throw new Error(error);
        }
    }

    checkData = (
        param: string | number,
        type: 'number' | 'string',
    ): boolean => {
        if (param === null || param === undefined) return false;
        switch (type) {
            case 'number':
                return !isNaN(Number(param)) && Number(param) > 0;
            case 'string':
                return typeof param === 'string' && param.trim().length > 0;
            default:
                return false;
        }
    };
}
