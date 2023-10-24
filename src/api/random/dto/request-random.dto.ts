import { ApiProperty } from '@nestjs/swagger';

export class RequestRandomDto {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    campaignSlug: string;

    @ApiProperty({})
    prizeId: string;
}
