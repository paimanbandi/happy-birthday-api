import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { HydratedUser, USER_MODEL, User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@Inject(USER_MODEL) private userModel: Model<User>) {}

  async create(dto: CreateUserDTO): Promise<HydratedUser> {
    return await this.userModel.create(dto);
  }

  async findByEmail(email: string): Promise<HydratedUser[]> {
    return await this.userModel.findOne({ email });
  }

  async find(): Promise<HydratedUser[]> {
    return await this.userModel.find();
  }

  async findById(id: string): Promise<HydratedUser[]> {
    return await this.userModel.findById(id);
  }
  async deleteOne(dto: DeleteUserDTO) {
    return await this.userModel.deleteOne({ _id: dto._id });
  }

  async update(id: string, dto: UpdateUserDTO): Promise<HydratedUser> {
    return await this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
