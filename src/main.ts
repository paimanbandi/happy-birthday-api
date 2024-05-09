import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger/swagger.config';
import ENV_VARS from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'PUT, POST, DELETE',
    allowedHeaders: 'Content-Type',
  });

  configureSwagger(app);
  await app.listen(ENV_VARS.ProjectPort);

  console.log(`Application is running on port ${ENV_VARS.ProjectPort}`);
}
bootstrap();
