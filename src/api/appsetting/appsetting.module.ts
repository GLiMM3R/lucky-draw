import { Module } from '@nestjs/common';
import { AppsettingService } from './appsetting.service';
import { AppsettingController } from './appsetting.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { UserModule } from '../user/user.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, LanguageModule, UserModule, FileUploadModule],
    controllers: [AppsettingController],
    providers: [AppsettingService],
})
export class AppsettingModule {}
