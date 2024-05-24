import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createUser(email: string): Promise<User> {
        if (!this.checkEmail(email, 'email')) {
            throw new HttpException('Invalid email', 400);
        }
        const userExist = await this.getUser(email);
        if (userExist) {
            throw new HttpException('User already exists', 409);
        }
        const createdUser = await this.addUser(email);
        if (!createdUser) {
            throw new HttpException('User could not be created', 500);
        }
        return createdUser;
    }

    async findUserByEmail(email: string) {
        if (!this.checkEmail(email, 'email')) {
            throw new HttpException('Invalid email', 400);
        }
        return this.getUser(email);
    }

    async addUser(email: string): Promise<User> {
        try {
            const user = this.usersRepository.create({
                email: email,
            });
            return await this.usersRepository.save(user);
        } catch (err) {
            return null;
        }
    }

    async getUser(email: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({
            email: email,
        });
        return user;
    }

    async getUserById(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async resetData(): Promise<void> {
        return this.usersRepository.clear();
    }

    checkEmail(param: string, type: string): boolean {
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(param);
        }
        return false;
    }
}
