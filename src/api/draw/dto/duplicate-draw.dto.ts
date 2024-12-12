import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export class DuplicateDraw {
    @ApiProperty({
        description: 'The title of campaign',
        type: String,
        example: 'Campaign end of year 2023',
    })
    @MaxLength(30)
    @MinLength(3)
    @Transform(({ value }) => value.toLowerCase())
    title: string;
}
