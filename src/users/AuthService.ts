import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { SigninParams, SignupParams } from 'src/interfaces/user.interfaces';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private emailService: EmailService,
  ) {}

  async signup({ email, password, username }: SignupParams): Promise<User> {
    await this.emailService.ensureUniqueEmail(email);
    const hashedPassword = await this.passwordService.hashPassword(password);
    const user = await this.usersService.create(
      email,
      hashedPassword,
      username,
    );

    return user;
  }

  async signin({ email, password }: SigninParams) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');
    const isCorrectPassword = await this.passwordService.checkPassword(
      password,
      user.password,
    );
    if (!isCorrectPassword) throw new BadRequestException('Wrong password');

    return user;
  }
}
