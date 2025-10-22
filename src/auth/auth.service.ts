import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const ok = await bcrypt.compare(password, user.password_hash ?? '');
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.seq.toString(), email: user.email };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return { message: 'Login successful', token: access_token };
  }
}
