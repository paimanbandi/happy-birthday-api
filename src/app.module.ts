import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import ENV_VARS from './config/env';
import { DatabaseModule } from './config/db/module.db';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(ENV_VARS.MongoStringUrl),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: ENV_VARS.RedisHost,
        port: Number(ENV_VARS.RedisPort),
      },
    }),
  ],
})
export class AppModule {}
