import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockContainerService;

  beforeEach(async () => {

    mockContainerService = {
      findById: jest.fn(),
      getPaginatedContainers: jest.fn(),
      generateToken: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IContainerService')
      .useValue(mockContainerService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  it('/container/:id/status should call HeaderAuthGuard but size the api-iv is invalid', () => {
    return request(app.getHttpServer())
      .get('/container/123/status')
      .set('x-api-token', 'mi-token')
      .set('x-api-iv', 'mi-iv') 
      .expect(401)
      .expect('{"message":"IV inválido: debe tener exactamente 32 caracteres hexadecimales","error":"Unauthorized","statusCode":401}');
  });

  it('/container/:id/status should call HeaderAuthGuard without api-key and api-iv', () => {
    return request(app.getHttpServer())
      .get('/container/123/status')
      .expect(401)
      .expect('{"message":"Los headers: x-api-token y x-api-iv obligatorio","error":"Unauthorized","statusCode":401}');
  });

  it('/container/:id/status should call HeaderAuthGuard but api-key or api-iv are invalid', () => {
    return request(app.getHttpServer())
      .get('/container/123/status')
      .set('x-api-token', 'mi-token')
      .set('x-api-iv', '12345678912345678912345678912345') 
      .expect(401)
      .expect('{"message":"x-api-token y/o x-api-iv invalidos","error":"Unauthorized","statusCode":401}');
  });

  it('should call /container/:id/status annd return container', () => {

    mockContainerService?.findById.mockResolvedValue({
      "_id": "6809e52d2e49dfd4c219b8a8",
      "containerId": "ABC1234",
      "timestamp": {
        "$date": "2025-04-24T07:15:57.150Z"
      },
      "state": "operational",
      "__v": 0
    })

    return request(app.getHttpServer())
      .get('/container/123/status')
      .set('x-api-token', '73f3465da441c636cb51b775bb1beb433e9664428a6d3d6aeee9922b9d1d4286')
      .set('x-api-iv', 'a9b3b4b3506c49518129d0d4a48b66f0') 
      .expect(200)
      .expect('{"_id":"6809e52d2e49dfd4c219b8a8","containerId":"ABC1234","timestamp":{"$date":"2025-04-24T07:15:57.150Z"},"state":"operational","__v":0}');
  });

  it('should call /container and return list container with pagination', () => {
    mockContainerService?.getPaginatedContainers.mockResolvedValue({
      "total": 1,
      "page": "1",
      "limit": "10",
      "lastPage": 1,
      "hasNextPage": false,
      "hasPrevPage": false,
      "nextPage": null,
      "prevPage": null,
      "data": [
          {
              "_id": "6809e52d2e49dfd4c219b8a8",
              "containerId": "ABC1234",
              "timestamp": "2025-04-24T07:15:57.150Z",
              "state": "operational",
              "__v": 0
          }
      ]
    })

    return request(app.getHttpServer())
      .get('/container')
      .set('x-api-token', '73f3465da441c636cb51b775bb1beb433e9664428a6d3d6aeee9922b9d1d4286')
      .set('x-api-iv', 'a9b3b4b3506c49518129d0d4a48b66f0') 
      .expect(200)
      .expect({
        total: 1,
        page: '1',
        limit: '10',
        lastPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
        data: [
          {
            _id: '6809e52d2e49dfd4c219b8a8',
            containerId: 'ABC1234',
            timestamp: '2025-04-24T07:15:57.150Z',
            state: 'operational',
            __v: 0
          }
        ]
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
