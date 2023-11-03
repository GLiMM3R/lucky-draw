import { Module } from '@nestjs/common';
import { WheelPrizeService } from './wheel-prize.service';
import { WheelPrizeController } from './wheel-prize.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [WheelPrizeController],
    providers: [WheelPrizeService],
})
export class WheelPrizeModule {}
