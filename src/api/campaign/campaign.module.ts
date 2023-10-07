import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { UserModule } from '../user/user.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, LanguageModule, UserModule, FileUploadModule],
    controllers: [CampaignController],
    providers: [CampaignService],
})
export class CampaignModule {}
