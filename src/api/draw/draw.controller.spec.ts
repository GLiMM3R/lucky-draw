import { Test, TestingModule } from '@nestjs/testing';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ResponseDraw } from './dto/response-draw.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { LanguageService } from 'src/config/lang/language.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

describe('DrawController', () => {
    let controller: DrawController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                I18nModule.forRoot({
                    fallbackLanguage: 'en',
                    loaderOptions: {
                        path: path.join(__dirname, '../../i18n/'),
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
            ],
            controllers: [DrawController],
            providers: [DrawService, PrismaService, LanguageService, FileUploadService],
        }).compile();

        controller = module.get<DrawController>(DrawController);
    });

    it('Get Draws', async () => {
        const findDraws = await controller.getDraws();

        expect(findDraws).toBeInstanceOf(ResponseDraw);
    });
});
