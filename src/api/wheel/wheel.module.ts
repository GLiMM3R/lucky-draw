import { Module } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { WheelController } from './wheel.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [WheelController],
    providers: [WheelService],
})
export class WheelModule {}
