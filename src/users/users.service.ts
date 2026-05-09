import { Injectable, ConflictException } from '@nestjs/common';

import { CreateUserDto } from './dto/users.dto';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUser: CreateUserDto) {
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

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  }

  async loginUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    return { user, token };
  }

  async getUserByToken(token: string) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);

      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        Array.isArray(decoded) ||
        (typeof (decoded as { userId?: unknown }).userId !== 'string' &&
          typeof (decoded as { userId?: unknown }).userId !== 'number')
      ) {
        throw new Error('Invalid token');
      }

      const userId = (decoded as { userId: number }).userId;
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Invalid token ${error}`);
    }
  }
}
