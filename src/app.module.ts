import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { EmailOtpModule } from './services/email-otp/email-otp.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

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
        EmailOtpModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
