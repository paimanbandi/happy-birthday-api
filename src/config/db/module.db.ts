import { Module } from '@nestjs/common';
import { databaseProviders } from './provider.db';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
