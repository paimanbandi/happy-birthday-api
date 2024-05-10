import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';

@ApiTags('User')
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
          email: 'bilal.king@gmail.com',
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
          email: 'james.bond@gmail.com',
          birthdayDate: '1980-12-31',
          location: 'Australia/Melbourne',
        },
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.userService.create(dto);
  }

  @ApiOperation({
    summary: 'Delete User',
  })
  @ApiBody({
    description: 'Delete User',
    type: DeleteUserDTO,
    examples: {
      a: {
        summary: 'Delete User',
        description: '-',
        value: {
          _id: '663ba401dc45ed7b60c4515e',
        },
      },
    },
  })
  @Delete()
  async delete(@Body() dto: DeleteUserDTO) {
    return this.userService.deleteOne(dto);
  }

  @ApiOperation({
    summary: 'Update User',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of User',
  })
  @ApiBody({
    description: 'Update User',
    type: UpdateUserDTO,
    examples: {
      a: {
        summary: 'Update User',
        description: '-',
        value: {
          firstName: 'Peter',
          lastName: 'Parker',
          email: 'peter.parker@gmail.com',
          birthdayDate: '1995-10-25',
          location: 'Australia/Melbourne',
        },
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.userService.update(id, dto);
  }
}
