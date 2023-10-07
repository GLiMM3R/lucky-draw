import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, Min } from 'class-validator';

export class CreateCampaignDto {
    @ApiProperty({
        description: 'The title of campaign',
        type: String,
        example: 'Campaign end of year 2023',
    })
    @MaxLength(30)
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The maximum win amount per user',
        example: '3',
    })
    @Min(0)
    prizeCap: number;

    @ApiProperty({
        description: 'The type of the campaign',
        example: 'random',
    })
    type: string;
}
