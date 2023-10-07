import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files API')
@Controller('files')
export class FilesController {
    @Get('/:folder/:filename')
    async getPrizeImage(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(join(process.env.UPLOAD_FILE_PATH, folder, filename));
    }
}
