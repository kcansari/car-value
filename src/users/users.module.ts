import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './AuthService';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    PasswordService,
    EmailService,
    SessionService,
  ],
})
export class UsersModule {}
