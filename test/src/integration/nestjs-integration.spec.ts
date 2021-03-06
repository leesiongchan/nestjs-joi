/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, INestApplication, Patch, Post, Put, Query } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as Joi from 'joi';

import { JoiPipe, JoiPipeModule, JoiSchema, JoiValidationGroups } from '../../../src';

describe('NestJS integration', () => {
  class metatype {
    @JoiSchema(Joi.string().required())
    @JoiSchema([JoiValidationGroups.CREATE], Joi.number().required())
    @JoiSchema([JoiValidationGroups.UPDATE], Joi.array().required())
    prop!: unknown;
  }

  let controller;
  let module: TestingModule;
  let app: INestApplication;
  let request_: request.Test;

  // Note: we will test one case (@Query or @Body) each, since the other cases
  // are considered to be equivalent

  describe('app module', () => {
    beforeEach(async () => {
      @Controller()
      class ctrl {
        @Get('/')
        get(@Query() query: metatype): unknown {
          return { status: 'OK' };
        }

        @Post('/')
        post(@Body() body: metatype): unknown {
          return { status: 'OK' };
        }

        @Put('/')
        put(@Body() body: metatype): unknown {
          return { status: 'OK' };
        }

        @Patch('/')
        patch(@Body() body: metatype): unknown {
          return { status: 'OK' };
        }
      }
      controller = ctrl;

      module = await Test.createTestingModule({
        controllers: [controller],
        imports: [JoiPipeModule],
      }).compile();

      app = module.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    describe('GET', () => {
      it('should use the pipe correctly (positive test)', async () => {
        return request(app.getHttpServer())
          .get('/?prop=foo')
          .expect(res =>
            expect(res.body).toEqual({
              status: 'OK',
            }),
          );
      });

      it('should use the pipe correctly (negative test)', async () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(res =>
            expect(res.body).toMatchObject({
              statusCode: 400,
              message: expect.stringContaining('"prop" is required'),
            }),
          );
      });
    });

    describe('POST', () => {
      it('should use the pipe correctly (positive test)', async () => {
        return request(app.getHttpServer())
          .post('/')
          .send({ prop: 1 })
          .expect(res =>
            expect(res.body).toEqual({
              status: 'OK',
            }),
          );
      });

      it('should use the pipe correctly (negative test)', async () => {
        return request(app.getHttpServer())
          .post('/')
          .send({ prop: 'a' })
          .expect(res =>
            expect(res.body).toMatchObject({
              statusCode: 400,
              message: expect.stringContaining('"prop" must be a number'),
            }),
          );
      });
    });

    describe('PUT', () => {
      it('should use the pipe correctly (positive test)', async () => {
        return request(app.getHttpServer())
          .put('/')
          .send({ prop: [] })
          .expect(res =>
            expect(res.body).toEqual({
              status: 'OK',
            }),
          );
      });

      it('should use the pipe correctly (negative test)', async () => {
        return request(app.getHttpServer())
          .put('/')
          .send({ prop: 'a' })
          .expect(res =>
            expect(res.body).toMatchObject({
              statusCode: 400,
              message: expect.stringContaining('"prop" must be an array'),
            }),
          );
      });
    });

    describe('PATCH', () => {
      it('should use the pipe correctly (positive test)', async () => {
        return request(app.getHttpServer())
          .patch('/')
          .send({ prop: [] })
          .expect(res =>
            expect(res.body).toEqual({
              status: 'OK',
            }),
          );
      });

      it('should use the pipe correctly (negative test)', async () => {
        return request(app.getHttpServer())
          .patch('/')
          .send({ prop: 'a' })
          .expect(res =>
            expect(res.body).toMatchObject({
              statusCode: 400,
              message: expect.stringContaining('"prop" must be an array'),
            }),
          );
      });
    });
  });

  describe('method parameter pipe', () => {
    beforeEach(async () => {
      @Controller()
      class ctrl {
        @Get('/')
        get(@Query(JoiPipe) query: metatype): unknown {
          return { status: 'OK' };
        }
      }
      controller = ctrl;

      module = await Test.createTestingModule({
        controllers: [controller],
      }).compile();

      app = module.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    it('should use the pipe correctly (positive test)', async () => {
      return request(app.getHttpServer())
        .get('/?prop=foo')
        .expect(res =>
          expect(res.body).toEqual({
            status: 'OK',
          }),
        );
    });

    it('should use the pipe correctly (negative test)', async () => {
      return request(app.getHttpServer())
        .get('/?prop=')
        .expect(res =>
          expect(res.body).toMatchObject({
            statusCode: 400,
            message: expect.stringContaining('"prop" is not allowed to be empty'),
          }),
        );
    });
  });
});
