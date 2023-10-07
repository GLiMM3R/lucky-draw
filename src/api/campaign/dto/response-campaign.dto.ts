import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from '@prisma/client';

export class ResponseCampaignDto {
    @ApiProperty({
        description: 'The id of the user',
        example: 'aa525a522a5252a534esf',
    })
    id: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'John Doe',
    })
    title: string;

    @ApiProperty({
        description: 'The prize cap of the camapign',
        example: '3',
    })
    prizeCap: number;

    @ApiProperty({
        description: 'The type of the campaign',
        example: 'random',
    })
    campaignType: string;

    @ApiProperty({
        description: 'The google id of the user',
        example: '2@H2398RH329F232F32H9FOJf',
    })
    prize: object;

    @ApiProperty()
    createdBy: object;

    @ApiProperty({
        description: 'The role of the user',
        example: 'user',
    })
    isActive: boolean;

    @ApiProperty()
    createdById: string;

    @ApiProperty({
        description: 'The date when the user was created',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'The date when the user was updated',
    })
    updatedAt: Date;

    constructor(campaign: Campaign) {
        this.id = campaign.id;
        this.title = campaign.title;
        this.prizeCap = campaign.prizeCap;
        this.campaignType = this.campaignType;
        this.isActive = campaign.isActive;
        this.createdById = campaign.createdById;
        this.createdAt = campaign.createdAt;
        this.updatedAt = campaign.updatedAt;
    }
}
