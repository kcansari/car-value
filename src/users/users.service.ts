import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, username: string) {
    const user = this.repo.create({ email, username, password });

    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }

    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.repo.remove(user);
  }
}
