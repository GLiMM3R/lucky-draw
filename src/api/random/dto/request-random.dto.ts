import { ApiProperty } from '@nestjs/swagger';

export class RequestRandomDto {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    campaignId: string;

    @ApiProperty({})
    prizeId: string;
}
