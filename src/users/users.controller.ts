import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(createUserDto);
    return {
      stastatusCode: 201,
      message: 'User created successfully',
      data: createdUser,
    };
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      stastatusCode: 200,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Post('login')
  async loginUser(
    @Body() credentials: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = credentials;
    const { user, token } = await this.usersService.loginUser(email, password);
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return {
      statusCode: 200,
      message: 'Login successful',
      data: { user, token },
    };
  }

  @Get('me')
  async getUserByToken(@Body('token') token: string) {
    const user = await this.usersService.getUserByToken(token);
    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  }
}
