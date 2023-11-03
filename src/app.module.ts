import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { FileUploadModule } from './services/file-upload/file-upload.module';
import { FilesController } from './api/files/files.controller';
import { FilesModule } from './api/files/files.module';
import { WheelModule } from './api/wheel/wheel.module';
import * as path from 'path';
import { WheelPrizeModule } from './api/wheel-prize/wheel-prize.module';
import { DrawModule } from './api/draw/draw.module';
import { DrawPrizeModule } from './api/draw-prize/draw-prize.module';
import { DrawReportModule } from './api/draw-report/draw-report.module';
import { WheelReportModule } from './api/wheel-report/wheel-report.module';

@Module({
    imports: [
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, './i18n/'),
                watch: true,
                includeSubfolders: true,
            },
            resolvers: [
                {
                    use: QueryResolver,
                    options: ['lang'],
                },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']), // this method is the same as AcceptLanguageResolver but it's for custom header
            ],
        }),
        PrismaModule,
        UserModule,
        AuthModule,
        DrawModule,
        DrawPrizeModule,
        DrawReportModule,
        WheelModule,
        WheelPrizeModule,
        WheelReportModule,
        FilesModule,
        FileUploadModule,
    ],
    controllers: [FilesController],
    providers: [],
})
export class AppModule {}
