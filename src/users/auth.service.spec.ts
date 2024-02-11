import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { User } from './user.entity';

it('can create an instance of auth service', async () => {
  // Createa a fake copy of the users service
  const fakeUsersService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string, username: string) =>
      Promise.resolve({ id: 1, email, password, username } as User),
  };

  const fakePasswordService = {
    hashPasword: (password: string) => Promise.resolve(password),
    checkPassword: () => Promise.resolve(true),
  };

  const fakeEmailService = {
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

  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
