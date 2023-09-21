// import { BadRequestException } from '@nestjs/common';
// import { ValidationError } from 'class-validator';
// import { CreateUserDto } from 'src/api/user/dto/create-user.dto';

// export async function validateUserCreate(createUserDto: CreateUserDto): Promise<void> {
//     //TODO - add validation
//     if (!createUserDto.username) {
//         throw new BadRequestException('Username is required');
//     } else if (!createUserDto.password) {
//         throw new BadRequestException('Password is required');
//     }

//     if (createUserDto.username.length < 3) {
//         throw new BadRequestException('Username must be at least 3 characters');
//     } else if (createUserDto.username.length > 20) {
//         throw new BadRequestException('Username must be at most 20 characters');
//     }

//     if (createUserDto.password.length < 8) {
//         throw new BadRequestException('Password must be at least 8 characters');
//     } else if (createUserDto.password.length > 20) {
//         throw new BadRequestException('Password must be at most 20 characters');
//     }
// }

// export async function validatePipe(validationErrors: ValidationError[] = []) {
//     const errorMessages = validationErrors.map((error) => {
//         const properties = error.property;
//         const message = Object.values(error.constraints).join(', ');

//         return { [properties]: message };
//     });

//     return errorMessages;
// }
