import * as mongoose from 'mongoose';
import { ENV_VARS } from '../env';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(ENV_VARS.MongoStringUrl),
  },
];
