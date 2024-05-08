import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose, Types } from 'mongoose';

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  birthdayDate: string;

  @Prop()
  location: string;

  @Prop({
    default: () => new Date(),
  })
  createdAt?: Date | null;

  @Prop({
    default: () => new Date(),
  })
  updatedAt?: Date | null;
}

export type HydratedUser = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_MODEL = 'USER_MODEL';

export const NestUserProvider = {
  provide: USER_MODEL,
  useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
  inject: ['DATABASE_CONNECTION'],
};
