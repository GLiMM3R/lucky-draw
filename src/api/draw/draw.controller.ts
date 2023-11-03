import { Body, Controller, Delete, Get, Post, Patch, Param, Res, Req, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateDraw, CreateDrawUploadFiles } from './dto/create-draw.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateDraw, UpdateDrawUploadFiles } from './dto/update-draw.dto';
import { Request, Response } from 'express';
import { RequestDraw } from './dto/request-draw.dto';
import { DrawService } from './draw.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Draw API')
@Controller('draws')
export class DrawController {
    constructor(private readonly drawService: DrawService) {}

    @Get()
    async getDraws() {
        return await this.drawService.getDraws();
    }

    @Get('id=:id')
    async getDrawById(@Param('id') id: string) {
        return await this.drawService.getDrawById(id);
    }

    @Get('slug=:slug')
    async getDrawBySlug(@Param('slug') slug: string) {
        return await this.drawService.getDrawBySlug(slug);
    }

    @Get('report/:id')
    async downloadDrawReport(@Param('id') id: string, @Res() res: Response) {
        const result = await this.drawService.downloadDrawReport(id);
        res.download(`${result}`);
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'backgroundImage', maxCount: 1 },
            { name: 'loadingImage', maxCount: 1 },
        ]),
    )
    @ApiConsumes('multipart/form-data', 'application/json')
    async createDraw(@Body() drawData: CreateDraw, @Req() request: Request, @UploadedFiles() files?: CreateDrawUploadFiles) {
        return await this.drawService.createDraw(drawData, request, files);
    }

    @Post('lucky-draw')
    async draw(@Body() drawData: RequestDraw, @Req() request: Request) {
        return await this.drawService.drawing(drawData, request);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'backgroundImage', maxCount: 1 },
            { name: 'loadingImage', maxCount: 1 },
        ]),
    )
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateDraw(@Param('id') id: string, @Body() drawData: UpdateDraw, @UploadedFiles() files?: UpdateDrawUploadFiles) {
        return await this.drawService.updateDraw(id, drawData, files);
    }

    @Patch(':id/dataset')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateDataset(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
        return await this.drawService.updateDataset(id, file);
    }

    @Delete(':id')
    async deleteDraw(@Param('id') id: string) {
        return await this.drawService.deleteDraw(id);
    }
}
