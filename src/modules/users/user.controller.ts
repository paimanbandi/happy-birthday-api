import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create User',
  })
  @ApiBody({
    description: 'Create User',
    type: CreateUserDTO,
    examples: {
      a: {
        summary: 'Create User Paiman Bandi',
        description: '-',
        value: {
          firstName: 'Paiman',
          lastName: 'Bandi',
          email: 'paiman.bandi@gmail.com',
          birthdayDate: '1988-05-07',
          location: 'Asia/Jakarta',
        },
      },
      b: {
        summary: 'Create User Bilal King',
        description: '-',
        value: {
          firstName: 'Bilal',
          lastName: 'King',
          birthdayDate: '1990-09-12',
          location: 'America/Toronto',
        },
      },
      c: {
        summary: 'Create User James Bond',
        description: '-',
        value: {
          firstName: 'James',
          lastName: 'Bond',
          birthdayDate: '1980-12-31',
          location: 'Australia/Melbourne',
        },
      },
    },
  })
  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return this.userService.create(dto);
  }
}
