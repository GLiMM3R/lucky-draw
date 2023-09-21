import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { IToken } from 'src/api/auth/auth.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    let token: IToken;
    let getData: any;
    const userLoginDto = {
        username: 'testSignup',
        password: '12345678',
    };

    test('/auth/signup (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                username: userLoginDto.username,
                password: userLoginDto.password,
            })
            .expect(201);

        return response;
    });

    test('/auth/signin (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: userLoginDto.username,
                password: userLoginDto.password,
            })
            .expect(201);

        token = response.body;

        return response;
    });

    test('/auth/me (GET)', async () => {
        getData = await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${token.access_token}`).expect(200);
        return getData;
    });

    test('/auth/refresh (POST)', async () => {
        return await request(app.getHttpServer()).post('/auth/refresh').set('Authorization', `Bearer ${token.refresh_token}`).expect(200);
    });

    test('/users/:id (DELETE)', async () => {
        return await request(app.getHttpServer()).delete(`/users/${getData.body.id}`).expect(200);
    });
});
