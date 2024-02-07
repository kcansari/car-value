import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class SessionService {
  setSession(user: User, session: any) {
    session.userId = user.id;
  }
}
