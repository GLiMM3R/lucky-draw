import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Files API')
@Controller('files')
export class FilesController {
    // @Get('/:folder/:filename')
    // async getImage(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    //     res.sendFile(join(process.env.UPLOAD_FILE_PATH, folder, filename));
    // }

    @Get('/:type/:slug/:folder/:filename')
    async getPrizeImage(
        @Param('type') type: string,
        @Param('slug') slug: string,
        @Param('folder') folder: string,
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        res.sendFile(join(__dirname, `../../../${process.env.UPLOAD_FILE_PATH}/${type}/${slug}/${folder}/${filename}`));
    }

    @Get('/download/:type/:slug/:folder/:filename')
    async downloadFile(
        @Param('type') type: string,
        @Param('slug') slug: string,
        @Param('folder') folder: string,
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        res.download(join(__dirname, `../../../${process.env.UPLOAD_FILE_PATH}/${type}/${slug}/${folder}/${filename}`));
    }
}
