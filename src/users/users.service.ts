import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.create({
      data: {
        uuid: randomUUID(),
        email: dto.email,
        password_hash,
        social_provider: 'NONE',
        name: dto.name,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findBySeq(seq: bigint) {
    return this.prisma.users.findUnique({ where: { seq } });
  }
}
