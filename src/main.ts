import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './config/interceptors/response.interceptor';
import { setupSwagger } from './config/swagger/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    setupSwagger(app);
    await app.listen(process.env.PORT, '0.0.0.0', async () => {
        console.log(`🚀 Application is running on: ${await app.getUrl()}/api-docs`);
    });
}
bootstrap();
