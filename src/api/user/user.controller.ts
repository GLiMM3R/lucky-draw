import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import { validateMongodbID } from '../../util/id.util';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    @ApiOperation({ summary: 'Create user', description: '## Create user with username and password', deprecated: true })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'User not created',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'Create user with username and password',
        examples: {
            user1: {
                summary: 'User 1',
                description: '## User 1 for John Doe',
                value: {
                    username: 'John Doe',
                    password: '12345678',
                },
            },
            User2: {
                summary: 'User 2',
                description: '## User 2 for John Dan',
                value: {
                    username: 'Jane Dan',
                    password: '12345678',
                },
            },
        },
    })
    // NOTE - This is create user
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const response = await this.userService.create(createUserDto);

        return new ResponseUserDto(response);
    }

    // @UseGuards(AuthGuard, RolesGuard)
    // @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOperation({ summary: 'Find all users', description: '## Find all users with no limit', deprecated: false })
    @ApiResponse({ status: HttpStatus.OK, description: 'Users found', type: [ResponseUserDto] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User not found' })
    @ApiQuery({
        name: 'page',
        type: Number,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
    })
    // NOTE - This is find all users
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.userService.findMany(page ? page : 1, limit ? limit : 100);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    @ApiOperation({ summary: 'Find one user', description: '## Find one user by id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: ResponseUserDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User not found' })
    // NOTE - This is find one user
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    @ApiOperation({ summary: 'Update one user', description: '## Update one user by id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User updated' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User not updated' })
    @ApiBody({
        type: UpdateUserDto,
        description: 'Create user with username and password',
        examples: {
            user1: {
                summary: 'User 1',
                description: '## User 1 for John Doe',
                value: {
                    username: 'John Doe',
                    password: '12345678',
                },
            },
            User2: {
                summary: 'User 2',
                description: '## User 2 for John Dan',
                value: {
                    username: 'Jane Dan',
                    password: '12345678',
                },
            },
        },
    })
    // NOTE - This is update one user
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        validateMongodbID(id);
        return this.userService.update(id, updateUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @ApiOperation({ summary: 'Remove one user', description: '## Remove one user by id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User removed' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User not removed' })
    // NOTE - This is remove one user
    async remove(@Param('id') id: string) {
        validateMongodbID(id);
        return await this.userService.remove(id);
    }
}
