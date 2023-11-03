import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateDrawUploadFiles {
    @ApiProperty({ type: String, format: 'binary', required: false })
    backgroundImage?: Express.Multer.File;

    @ApiProperty({ type: String, format: 'binary', required: false })
    loadingImage?: Express.Multer.File;
}

export class UpdateDraw extends UpdateDrawUploadFiles {
    @ApiProperty({
        description: 'The title of campaign',
        example: 'Campaign end of year 2023',
        required: false,
    })
    @Transform(({ value }) => value.toLowerCase())
    title?: string;

    @ApiProperty({
        description: 'The maximum win amount per user',
        example: '3',
        required: false,
    })
    @Transform(({ value }) => Number(value))
    prizeCap?: number;

    @ApiProperty({
        description: 'The template of device ',
        example: 'desktop',
        required: false,
    })
    @Transform(({ value }) => value.toLowerCase())
    device?: string;

    @ApiProperty({
        required: false,
    })
    @Transform(({ value }) => Boolean(value))
    isComplete?: boolean;
}
