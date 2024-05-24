import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async addUser(@Body() user: { email: string }): Promise<User> {
        return this.userService.createUser(user.email);
    }

    @Get(':email')
    getUserByEmail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }
}
