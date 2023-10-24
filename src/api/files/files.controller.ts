import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Files API')
@Controller('files')
export class FilesController {
    @Get('/:folder/:filename')
    async getImage(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(join(process.env.UPLOAD_FILE_PATH, folder, filename));
    }

    @Get('/:folder/:slug/:filename')
    async getPrizeImage(@Param('folder') folder: string, @Param('slug') slug: string, @Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(join(process.env.UPLOAD_FILE_PATH, folder, slug, filename));
    }

    @Get('/download/:folder/:slug/:filename')
    async downloadFile(@Param('folder') folder: string, @Param('slug') slug: string, @Param('filename') filename: string, @Res() res: Response) {
        res.download(join(process.env.UPLOAD_FILE_PATH, folder, slug, filename));
    }
}
