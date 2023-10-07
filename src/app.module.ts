import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { CampaignModule } from './api/campaign/campaign.module';
import { PrizeModule } from './api/prize/prize.module';
import { WinnerRecordModule } from './api/winner-record/winner-record.module';
import { FileUploadModule } from './services/file-upload/file-upload.module';
import { FilesController } from './api/files/files.controller';
import { FilesModule } from './api/files/files.module';
import { CouponsModule } from './api/coupons/coupons.module';
import { RandomModule } from './api/random/random.module';
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
        CampaignModule,
        PrizeModule,
        WinnerRecordModule,
        FileUploadModule,
        FilesModule,
        CouponsModule,
        RandomModule,
    ],
    controllers: [FilesController],
    providers: [],
})
export class AppModule {}
