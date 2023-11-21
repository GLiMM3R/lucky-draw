import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IToken } from 'src/api/auth/auth.service';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('DrawController', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    let token: IToken;
    let draw: any;
    const createDraw = {
        title: 'test e2e',
        prizeCap: 3,
        device: 'desktop',
    };

    const updateDraw = {
        title: 'test e2e update',
        prizeCap: 5,
        device: 'mobile',
        isComplete: true,
    };

    test('/auth/signin (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: 'jmart01',
                password: 'jmart01',
            })
            .expect(201);

        token = response.body;

        return response;
    });

    test('/draws (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/draws')
            .set('Authorization', `Bearer ${token.access_token}`)
            .send(createDraw)
            .expect(201);

        return response;
    });

    test('/draws (GET)', async () => {
        const response = await request(app.getHttpServer()).get('/draws').set('Authorization', `Bearer ${token.access_token}`).expect(200);

        draw = response.body[0];

        return response;
    });

    test('/draws/id=:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/draws/id=${draw.id}`)
            .set('Authorization', `Bearer ${token.access_token}`)
            .expect(200);

        return response;
    });

    test('/draws/slug=:slug (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/draws/slug=${draw.slug}`)
            .set('Authorization', `Bearer ${token.access_token}`)
            .expect(200);

        return response;
    });

    test('/draws/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .post(`/draws/${draw.id}`)
            .set('Authorization', `Bearer ${token.access_token}`)
            .send(updateDraw)
            .expect(200);

        return response;
    });

    test('/draws/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .post(`/draws/${draw.id}`)
            .set('Authorization', `Bearer ${token.access_token}`)
            .send(updateDraw)
            .expect(200);

        return response;
    });
});
