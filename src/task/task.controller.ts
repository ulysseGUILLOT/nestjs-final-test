import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
@Controller()
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post()
    async addTask(
        @Body() body: { name: string; userId: number; priority: number },
    ) {
        return this.taskService.createTask(
            body.name,
            body.userId,
            body.priority,
        );
    }

    @Get(':name')
    async getTaskByName(@Param('name') name: string) {
        return this.taskService.fetchTaskByName(name);
    }

    @Get('user/:userId')
    async getTaskByUserId(@Param('userId') userId: number) {
        return this.taskService.fetchTasksByUserId(userId);
    }

    @Delete('reset')
    async resetData() {
        this.taskService.resetData();
    }
}
