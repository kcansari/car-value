import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;

    return salt + '.' + hashBuffer.toString('hex');
  }

  async checkPassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const [salt, storedHash] = userPassword.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return Boolean(storedHash === hash.toString('hex'));
  }
}
