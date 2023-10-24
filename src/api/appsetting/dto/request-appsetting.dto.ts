import { ApiProperty } from '@nestjs/swagger';

export class RequestAppSettingDto {
    @ApiProperty({
        description: 'Type to update',
        example: 'wheel',
        type: String,
    })
    type: string;

    @ApiProperty({ type: String, format: 'binary', required: false })
    image?: Express.Multer.File;
}
