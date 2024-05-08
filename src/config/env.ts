import * as path from 'path';
import * as dotenv from 'dotenv';

type EnvironmentVariables = {
  ProjectPort: string;
  MongoStringUrl: string;
  RedisHost: string;
  RedisPort: string;
};

const getEnvVars = (): EnvironmentVariables => {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
  });

  return {
    ProjectPort: String(process.env.PROJECT_PORT),
    MongoStringUrl: String(process.env.MONGO_STRING_URL),
    RedisHost: String(process.env.REDIS_HOST),
    RedisPort: String(process.env.REDIS_PORT),
  };
};

export const ENV_VARS = getEnvVars();

export default ENV_VARS;
