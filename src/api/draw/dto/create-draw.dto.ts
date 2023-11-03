import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDrawUploadFiles {
    @ApiProperty({ type: String, format: 'binary', required: false })
    backgroundImage?: Express.Multer.File;

    @ApiProperty({ type: String, format: 'binary', required: false })
    loadingImage?: Express.Multer.File;
}

export class CreateDraw extends CreateDrawUploadFiles {
    @ApiProperty({
        description: 'The title of campaign',
        type: String,
        example: 'Campaign end of year 2023',
    })
    @MaxLength(30)
    @MinLength(3)
    @Transform(({ value }) => value.toLowerCase())
    title: string;

    @ApiProperty({
        description: 'The maximum win amount per user',
        example: '3',
    })
    @Min(0)
    @Transform(({ value }) => Number(value))
    prizeCap: number;

    @ApiProperty({
        description: 'The template of device ',
        example: 'desktop',
    })
    @Transform(({ value }) => value.toLowerCase())
    device: string;
}
