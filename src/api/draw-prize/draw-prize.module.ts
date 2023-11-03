import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { LanguageModule } from 'src/config/lang/language.module';
import { FileUploadModule } from 'src/services/file-upload/file-upload.module';
import { DrawPrizeController } from './draw-prize.controller';
import { DrawPrizeService } from './draw-prize.service';

@Module({
    imports: [PrismaModule, LanguageModule, FileUploadModule],
    controllers: [DrawPrizeController],
    providers: [DrawPrizeService],
})
export class DrawPrizeModule {}
