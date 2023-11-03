import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWheel {
    @ApiProperty({
        description: 'The title of campaign',
        type: String,
        example: 'Campaign end of year 2023',
    })
    @MaxLength(30)
    @MinLength(3)
    @Transform(({ value }) => value.toLowerCase())
    title: string;

    @ApiProperty({ type: String, format: 'binary', required: false })
    baseIcon?: Express.Multer.File;
}
