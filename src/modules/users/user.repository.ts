import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';
import { HydratedUser, USER_MODEL, User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@Inject(USER_MODEL) private userModel: Model<User>) {}

  async create(dto: CreateUserDTO): Promise<HydratedUser> {
    return await this.userModel.create(dto);
  }

  async find(): Promise<HydratedUser[]> {
    return await this.userModel.find().exec();
  }

  async delete(dto: DeleteUserDTO): Promise<HydratedUser> {
    return await this.userModel.findByIdAndDelete(dto._id);
  }
}
