import { Injectable, ConflictException } from '@nestjs/common';

import { CreateUserDto } from './dto/users.dto';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { User } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUser: CreateUserDto): Promise<User> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUser.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        password: hashedPassword,
        role: createUser.role as 'MEMBER' | 'ADMIN' | 'MODERATOR',
      },
    });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  }
}
