import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { LanguageService } from 'src/config/lang/language.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RequestAppSettingDto } from './dto/request-appsetting.dto';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Injectable()
export class AppsettingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly languageService: LanguageService,
        private readonly userService: UserService,
        private readonly fileUploadService: FileUploadService,
    ) {}
    async getAppSetting(request: Request) {
        if (!request['user']) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        const user = await this.userService.getUser(request['user'].sub.id);

        const findApp = await this.prisma.appSetting.findFirst({ where: { createdById: user.id } });

        // if (!findApp) {
        //     throw new NotFoundException();
        // }

        return findApp;
    }

    async upsertAppSetting(requestData: RequestAppSettingDto, imageData: Express.Multer.File, request: Request) {
        if (!request['user']) {
            throw new UnauthorizedException(this.languageService.TOKEN_INVALID());
        }

        const user = await this.userService.getUser(request['user'].sub.id);

        const findApp = await this.prisma.appSetting.findFirst({ where: { createdById: user.id } });

        if (requestData.type === 'random') {
            if (findApp && findApp.randomImage) {
                const fileExists = await this.fileUploadService.fileExists(findApp.randomImage);
                if (fileExists) {
                    await this.fileUploadService.deleteFile(findApp.randomImage);
                }
            }

            let image = '';
            if (imageData) {
                image = await this.fileUploadService.uploadFile(imageData, 'appsetting');
            }

            const upsertApp = await this.prisma.appSetting.upsert({
                where: {
                    id: findApp.id,
                },
                update: {
                    randomImage: image,
                },
                create: {
                    createdById: user.id,
                    randomImage: image,
                },
            });

            return upsertApp;
        } else if (requestData.type === 'wheel') {
            if (findApp && findApp.wheelImage) {
                const fileExists = await this.fileUploadService.fileExists(findApp.wheelImage);
                if (fileExists) {
                    await this.fileUploadService.deleteFile(findApp.wheelImage);
                }
            }

            let image = '';
            if (imageData) {
                image = await this.fileUploadService.uploadFile(imageData, 'appsetting');
            }

            const upsertApp = await this.prisma.appSetting.upsert({
                where: {
                    createdById: user.id,
                },
                update: {
                    wheelImage: image,
                },
                create: {
                    createdById: user.id,
                    wheelImage: image,
                },
            });

            return upsertApp;
        }
    }
}
