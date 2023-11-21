import { Body, Controller, Delete, Get, Post, Patch, Param, Req, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { CreateDraw, CreateDrawUploadFiles } from './dto/create-draw.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateDraw, UpdateDrawUploadFiles } from './dto/update-draw.dto';
import { Request } from 'express';
import { RequestDraw } from './dto/request-draw.dto';
import { DrawService } from './draw.service';
import { DuplicateDraw } from './dto/duplicate-draw.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Draw API')
@Controller('draws')
export class DrawController {
    constructor(private readonly drawService: DrawService) {}

    @Get()
    async getDraws(@Req() request: Request) {
        return await this.drawService.getDraws(request);
    }

    @Get('id=:id')
    async getDrawById(@Param('id') id: string, @Req() request: Request) {
        return await this.drawService.getDrawById(id, request);
    }

    @Get('slug=:slug')
    async getDrawBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.drawService.getDrawBySlug(slug, request);
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

    @Post('/:id/duplicate')
    async duplicateCampaign(@Param('id') id: string, @Body() drawData: DuplicateDraw, @Req() request: Request) {
        return await this.drawService.duplicateCampaign(id, drawData, request);
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
    async updateDraw(@Param('id') id: string, @Body() drawData: UpdateDraw, @Req() request: Request, @UploadedFiles() files?: UpdateDrawUploadFiles) {
        return await this.drawService.updateDraw(id, drawData, request, files);
    }

    @Patch(':id/dataset')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateDataset(@Param('id') id: string, @Req() request: Request, @UploadedFile() file?: Express.Multer.File) {
        return await this.drawService.updateDataset(id, request, file);
    }

    @Post(':id/remove-background')
    async removeBackgroundImage(@Param('id') id: string, @Req() request: Request) {
        return await this.drawService.removeBackgroundImage(id, request);
    }

    @Post(':id/remove-loading')
    async removeLoadingImage(@Param('id') id: string, @Req() request: Request) {
        return await this.drawService.removeLoadingImage(id, request);
    }

    @Delete(':id')
    async deleteDraw(@Param('id') id: string, @Req() request: Request) {
        return await this.drawService.deleteDraw(id, request);
    }
}
