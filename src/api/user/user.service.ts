import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../../config/prisma/prisma.service';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcrypt';
import { LanguageService } from '../../config/lang/language.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly langService: LanguageService,
    ) {}

    // NOTE - This is create user
    async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        // NOTE - This is where you would check the user's credentials
        await this.findDupByUsername(createUserDto.username);

        // NOTE - This is where you would hash the user's password
        const hash = await bcrypt.hash(createUserDto.password, +process.env.SALT_ROUNDS);

        const createUser = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hash,
            },
        });

        return new ResponseUserDto(createUser);
    }

    // NOTE - This is find all users
    // REVIEW - This function is for pagination but it is not working for complete pagination
    async findMany(skip: number, take: number): Promise<ResponseUserDto[]> {
        const page = parseInt(String(skip));
        const limit = parseInt(String(take));
        const users = await this.prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });

        return users.map((user) => new ResponseUserDto(user));
    }

    // NOTE - This is find one user
    async getUser(id: string): Promise<ResponseUserDto> {
        // const _idValidation = await validateMongodbID(id);
        // if (!_idValidation) {
        //     throw new BadRequestException(this.langService.CREDENTIAL_NOT_MATCH());
        // }

        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new BadRequestException(this.langService.USER_NOT_FOUND());
        }

        return new ResponseUserDto(user);
    }

    // NOTE - This is update user
    async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        await this.getUser(id);
        return this.prisma.user
            .update({
                where: {
                    id: id,
                },
                data: {
                    ...updateUserDto,
                },
            })
            .then((user) => new ResponseUserDto(user));
    }

    // NOTE - This is remove user
    async remove(id: string): Promise<void> {
        await this.getUser(id);
        await this.prisma.user.delete({
            where: {
                id: id,
            },
        });
    }

    // SECTION - this is a custom function to find a user by username for validation
    // NOTE - This is find one user by username
    async findDupByUsername(username: string): Promise<User> {
        const findDup = await this.prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (findDup) {
            throw new BadRequestException(this.langService.USERNAME_EXIST(findDup?.username));
        }

        return findDup;
    }

    // NOTE - This is find one user by username
    async findOneByUsername(username: string, pass?: string): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (!user) {
            throw new BadRequestException(this.langService.CREDENTIAL_TAKEN());
        }

        if (pass) {
            await this.passwordCompare(pass, user.password);
        }

        return user;
    }

    // NOTE - This is compare password
    async passwordCompare(pass: string, hash: string): Promise<boolean> {
        const verifyPassword = await bcrypt.compare(pass, hash);

        if (verifyPassword === false) {
            throw new BadRequestException(this.langService.CREDENTIAL_TAKEN());
        }

        return verifyPassword;
    }

    // !SECTION -- end of custom function
}
