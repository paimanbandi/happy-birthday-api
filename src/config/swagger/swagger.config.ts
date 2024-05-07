import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Happy Birthday API')
    .setDescription('Happy Birthday API Doc')
    .addBearerAuth({
      description: 'Bearer Token',
      type: 'http',
      name: 'Authorization',
    })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      requestInterceptor: (req: any) => {
        req.credentials = 'include';
        return req;
      },
      persistAuthorization: true,
      syntaxHighlight: {
        activate: true,
        theme: 'obsidian',
      },
      docExpansion: 'none',
      displayRequestDuration: true,
      defaultModelExpandDepth: 8,
      defaultModelsExpandDepth: 8,
    },
    customSiteTitle: 'Happy Birthday API Doc',
  });
};
