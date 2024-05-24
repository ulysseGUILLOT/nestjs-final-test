import { AppRoutingModule } from './app.routing-module';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Task } from './task/task.entity';
@Module({
    imports: [AppRoutingModule, ConfigurationModule, DatabaseModule, TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 24000,
        password: 'postgres',
        username: 'postgres',
        entities: [User, Task],
        database: 'postgres',
        synchronize: true,
        logging: true,
    }),],
})
export class AppModule { }
