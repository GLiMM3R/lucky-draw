import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './config/interceptors/response.interceptor';
import { setupSwagger } from './config/swagger/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // NOTE - This is for CORS (Cross-Origin Resource Sharing)
    app.enableCors();
    // NOTE - This is for interceptors (middleware)
    app.useGlobalInterceptors(new ResponseInterceptor());

    // NOTE - This is for swagger documentation
    setupSwagger(app);

    // NOTE - This is for the port and host
    await app.listen(process.env.PORT, '0.0.0.0', async () => {
        console.log(`🚀 Application is running on: ${await app.getUrl()}/api-docs`);
    });
}
bootstrap();
