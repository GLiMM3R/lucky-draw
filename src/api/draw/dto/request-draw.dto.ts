import { ApiProperty } from '@nestjs/swagger';

export class RequestDraw {
    @ApiProperty({
        description: 'The id of draw',
        type: String,
    })
    slug: string;

    @ApiProperty({
        description: 'The id of prize',
        type: String,
    })
    prizeId: string;
}
