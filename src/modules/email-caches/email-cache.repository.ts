import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateEmailCacheDTO } from 'src/dto/create-email-cache.dto';
import {
  EMAIL_CACHE_MODEL,
  EmailCache,
  HydratedEmailCache,
} from 'src/schemas/email-cache.schema';

@Injectable()
export class EmailCacheRepository {
  constructor(
    @Inject(EMAIL_CACHE_MODEL) private userModel: Model<EmailCache>,
  ) {}

  async create(dto: CreateEmailCacheDTO): Promise<HydratedEmailCache> {
    return await this.userModel.create(dto);
  }

  async findByIdentifier(identifier: string): Promise<HydratedEmailCache> {
    return await this.userModel.findOne({ identifier }).exec();
  }
}
