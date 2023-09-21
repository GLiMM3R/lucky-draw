import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard, RefreshGuard } from '../../guard/auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';
import { Role } from '../../config/enums/role.enum';
import { AuthResponseDto } from './dto/response-auth.dto';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    @ApiOperation({ summary: 'Signup user', description: '## Create user with username and password' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Signup successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed to signup',
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
    async signUp(@Body() signUpAuthDto: CreateUserDto): Promise<void> {
        await this.authService.signUp(signUpAuthDto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signin')
    @ApiOperation({ summary: 'Sign in user', description: '## Sign in user with username and password' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Sign in successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed to sign in',
    })
    @ApiBody({
        type: AuthDto,
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
    async signIn(@Body() signInDto: AuthDto): Promise<AuthResponseDto> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @ApiBearerAuth()
    @UseGuards(RefreshGuard)
    @HttpCode(HttpStatus.OK)
    @Roles(Role.User)
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh token', description: '## Refresh token' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Refresh token successfully',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async refreshToken(@Req() token: any): Promise<AuthResponseDto> {
        return await this.authService.refreshToken(token.user);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    @ApiOperation({ summary: 'Get profile', description: '## Get profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get profile successfully',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async getProfile(@Req() req: any) {
        // NOTE - transform user object to user response dto
        const user = req.user;
        const response = {
            id: user.sub.user,
            username: user.username,
        };

        return response;
    }
}
