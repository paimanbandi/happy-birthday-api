import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from 'src/config/db/module.db';
import { UserController } from './user.controller';
import { NestUserProvider } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { HttpModule } from '@nestjs/axios';
import { EmailWorker } from 'src/workers/email.worker';
import { EmailQueue } from 'src/queue/email.queue';
import { BullModule } from '@nestjs/bull';
import { EmailCacheRepository } from '../email-caches/email-cache.repository';
import { NestEmailCacheProvider } from 'src/schemas/email-cache.schema';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [UserController],
  providers: [
    NestUserProvider,
    NestEmailCacheProvider,
    UserService,
    UserRepository,
    EmailCacheRepository,
    EmailQueue,
    EmailWorker,
  ],
})
export class UserModule {}
