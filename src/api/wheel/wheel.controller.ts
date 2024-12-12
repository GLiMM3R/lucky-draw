import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { CreateWheel } from './dto/create-wheel.dto';
import { UpdateWheel } from './dto/update-wheel.dto';
import { AuthGuard } from '../../guard/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DuplicateWheel } from './dto/duplicate-wheel.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Wheel API')
@Controller('wheels')
export class WheelController {
    constructor(private readonly wheelService: WheelService) {}

    @Get()
    async getWheels(@Req() request: Request) {
        return await this.wheelService.getWheels(request);
    }

    @Get('id=:id')
    async getWheelById(@Param('id') id: string, @Req() request: Request) {
        return await this.wheelService.getWheelById(id, request);
    }

    @Get('slug=:slug')
    async getWheelBySlug(@Param('slug') slug: string, @Req() request: Request) {
        return await this.wheelService.getWheelBySlug(slug, request);
    }

    @Post()
    @UseInterceptors(FileInterceptor('baseIcon'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createWheel(@Body() wheelData: CreateWheel, @Req() request: Request, @UploadedFile() baseIcon?: Express.Multer.File) {
        return await this.wheelService.createWheel(wheelData, request, baseIcon);
    }

    @Post('/:id/duplicate')
    async duplicateCampaign(@Param('id') id: string, @Body() wheelData: DuplicateWheel, @Req() request: Request) {
        return await this.wheelService.duplicateCampaign(id, wheelData, request);
    }

    @Post(':id/remove-baseicon')
    async removeBaseIcon(@Param('id') id: string, @Req() request: Request) {
        return await this.wheelService.removeBaseIcon(id, request);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('baseIcon'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateWheel(
        @Param('id') id: string,
        @Body() wheelData: UpdateWheel,
        @Req() request: Request,
        @UploadedFile() baseIcon?: Express.Multer.File,
    ) {
        return await this.wheelService.updateWheel(id, wheelData, request, baseIcon);
    }

    @Delete(':id')
    async deleteWheel(@Param('id') id: string, @Req() request: Request) {
        return await this.wheelService.deleteWheel(id, request);
    }
}
