import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    // run something before a request is handled by the request handler
    const request = context.switchToHttp().getRequest();

    const { userID } = request.session || {};

    if (userID) {
      const user = await this.usersService.findOne(userID);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
