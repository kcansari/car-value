import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Injectable()
export class EmailService {
  constructor(private usersService: UsersService) {}
  async ensureUniqueEmail(email: string): Promise<void> {
    const hasEmail = await this.usersService.find(email);
    if (hasEmail.length) {
      throw new BadRequestException('Email in use');
    }
  }
}
