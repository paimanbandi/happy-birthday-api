import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose, Types } from 'mongoose';

@Schema()
export class EmailCache {
  @Prop({ unique: true })
  identifier: string;

  @Prop({
    default: () => new Date(),
  })
  createdAt?: Date | null;

  @Prop({
    default: () => new Date(),
  })
  updatedAt?: Date | null;
}

export type HydratedEmailCache = HydratedDocument<EmailCache>;

export const EmailCacheSchema = SchemaFactory.createForClass(EmailCache);

export const EMAIL_CACHE_MODEL = 'EMAIL_CACHE_MODEL';

export const NestEmailCacheProvider = {
  provide: EMAIL_CACHE_MODEL,
  useFactory: (mongoose: Mongoose) =>
    mongoose.model('EmailCache', EmailCacheSchema),
  inject: ['DATABASE_CONNECTION'],
};
