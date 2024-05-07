import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PROJECT_PORT', 3000);
  app.enableCors({
    origin: true,
    methods: 'GET, PUT, POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  configureSwagger(app);
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
}
bootstrap();
