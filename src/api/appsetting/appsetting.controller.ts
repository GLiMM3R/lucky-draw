import { Body, Controller, Post, Req, UseInterceptors, UploadedFile, UseGuards, Get } from '@nestjs/common';
import { AppsettingService } from './appsetting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequestAppSettingDto } from './dto/request-appsetting.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('AppSetting API')
@Controller('appsetting')
export class AppsettingController {
    constructor(private readonly appsettingService: AppsettingService) {}

    @Get()
    async getAppSetting(@Req() request: Request) {
        return await this.appsettingService.getAppSetting(request);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async upsertAppSetting(@Body() requestData: RequestAppSettingDto, @Req() request: Request, @UploadedFile() image: Express.Multer.File) {
        return await this.appsettingService.upsertAppSetting(requestData, image, request);
    }
}
