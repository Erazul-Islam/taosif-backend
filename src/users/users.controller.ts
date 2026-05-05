import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

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
}
