import { ApiProperty } from '@nestjs/swagger';

export class CreateWheelReport {
    @ApiProperty({
        description: 'The id of campaign',
        type: String,
    })
    wheelId: string;

    @ApiProperty({
        description: 'The id of prize',
    })
    prizeId: string;
}
