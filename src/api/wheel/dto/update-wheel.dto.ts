import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateWheel {
    @ApiProperty({
        description: 'The title of campaign',
        example: 'Campaign end of year 2023',
        required: false,
    })
    @Transform(({ value }) => value.toLowerCase())
    title?: string;

    @ApiProperty({ type: String, format: 'binary', required: false })
    baseIcon?: Express.Multer.File;

    @ApiProperty({
        required: false,
    })
    @Transform(({ value }) => Boolean(value))
    isComplete?: boolean;
}
