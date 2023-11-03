import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { CreateWheel } from './dto/create-wheel.dto';
import { UpdateWheel } from './dto/update-wheel.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Wheel API')
@Controller('wheels')
export class WheelController {
    constructor(private readonly wheelService: WheelService) {}

    @Get()
    async getWheels() {
        return await this.wheelService.getWheels();
    }

    @Get('id=:id')
    async getWheelById(@Param('id') id: string) {
        return await this.wheelService.getWheelById(id);
    }

    @Get('slug=:slug')
    async getWheelBySlug(@Param('slug') slug: string) {
        return await this.wheelService.getWheelBySlug(slug);
    }

    @Post()
    @UseInterceptors(FileInterceptor('baseIcon'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createWheel(@Body() wheelData: CreateWheel, @Req() request: Request, @UploadedFile() baseIcon?: Express.Multer.File) {
        return await this.wheelService.createWheel(wheelData, request, baseIcon);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('baseIcon'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async updateWheel(@Param('id') id: string, @Body() wheelData: UpdateWheel, @UploadedFile() baseIcon?: Express.Multer.File) {
        return await this.wheelService.updateWheel(id, wheelData, baseIcon);
    }

    @Delete(':id')
    async deleteWheel(@Param('id') id: string) {
        return await this.wheelService.deleteWheel(id);
    }
}
