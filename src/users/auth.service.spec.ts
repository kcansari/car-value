import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;
let fakeEmailService: Partial<EmailService>;
let fakePasswordService: Partial<PasswordService>;

describe('AuthService', () => {
  beforeEach(async () => {
    // Createa a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string, username: string) =>
        Promise.resolve({ id: 1, email, password, username } as User),
    };

    fakePasswordService = {
      hashPassword: (password: string) =>
        Promise.resolve('salt' + '.' + password),
      checkPassword: () => Promise.resolve(true),
    };

    fakeEmailService = {
      ensureUniqueEmail: () => Promise.resolve(),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: PasswordService,
          useValue: fakePasswordService,
        },
        {
          provide: EmailService,
          useValue: fakeEmailService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const request = {
      email: 'test@gmail.com',
      password: '12345',
      username: 'test',
    };
    const user = await service.signup({
      email: request.email,
      password: request.password,
      username: request.username,
    });
    expect(user.password).not.toEqual(request.password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    fakeEmailService.ensureUniqueEmail = () => {
      throw new BadRequestException('Email in use');
    };
    expect(
      service.signup({
        email: 'a',
        password: '1',
        username: 'test',
      }),
    ).rejects.toThrow(new BadRequestException('Email in use'));
  });

  it('throws if signin is called with an unsued email', async () => {
    expect(
      service.signin({
        email: '1231',
        password: '232',
      }),
    ).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'sdad@dsada.com',
          password: '21312',
          username: 'sdas',
        } as User,
      ]);
    fakePasswordService.checkPassword = () => Promise.resolve(false);

    expect(
      service.signin({
        email: '1231',
        password: '232',
      }),
    ).rejects.toThrow(new BadRequestException('Wrong password'));
  });

  it('return a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'sdad@dsada.com',
          password: '21312',
          username: 'sdas',
        } as User,
      ]);
    fakePasswordService.checkPassword = () => Promise.resolve(true);
    const user = await service.signin({
      email: 'sdad@dsada.com',
      password: '21312',
    });
    expect(user).toBeDefined();
  });
});
