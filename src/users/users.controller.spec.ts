import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let fakeSessionService: Partial<SessionService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findOne: async (id: number) => {
        const [user] = users.filter((user) => user.id === id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        return Promise.resolve(user);
      },
      find: (email: string) => {
        const hasUser = users.filter((user) => user.email === email);
        return Promise.resolve(hasUser);
      },
      remove: (id: number) => {
        const [user] = users.filter((user) => user.id === id);
        return Promise.resolve(user);
      },
      update: (id: number, attrs: Partial<User>) => {
        const [user] = users.filter((user) => user.id === id);
        Object.assign(user, attrs);
        return Promise.resolve(user);
      },
    };

    fakeAuthService = {
      // signup: ({ email, password, username }: SignupParams) => {},
      // signin: () => {},
    };

    fakeSessionService = {
      setSession: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: SessionService,
          useValue: fakeSessionService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    expect(controller.findUser('1')).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });
});
