import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

/**
 * Swagger
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('NestJS Study API Docs')
        .setDescription('NestJS Study API description')
        .addBearerAuth({
            description: 'Default JWT Authorization',
            type: 'http',
            in: 'headers',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .addGlobalParameters({
            name: 'Accept-Language',
            in: 'header',
            required: true,
            example: 'en',
            description: 'The preferred language of the client: en, lo',
        })
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    const customSiteTitle: SwaggerCustomOptions = {
        customSiteTitle: 'Study API Docs',
    };
    SwaggerModule.setup('api-docs', app, document, customSiteTitle);
}
