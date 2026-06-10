const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let server;
let app;

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

jest.setTimeout(30000);

describe('Auth refresh/rotation/revoke flows', () => {
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongo.getUri();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    const srv = require('../server');
    app = srv.app;
    await srv.connectWithRetry();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('register -> login sets refresh cookie and creates DB token; refresh rotates token; logout revokes token', async () => {
    // register
    const email = 'test@example.com';
    const password = 'password123';
    const { status, headers, body } = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });
    expect(status).toBe(201);
    expect(body.user.email).toBe(email);
    expect(body.accessToken).toBeTruthy();
    const setCookie = headers['set-cookie'];
    expect(setCookie && setCookie.some(s => s.includes('refreshToken='))).toBe(true);

    // stored in DB
    const stored = await RefreshToken.findOne({ user: body.user._id });
    expect(stored).toBeTruthy();
    const originalToken = stored.token;

    // call refresh using cookie
    const cookie = setCookie[0].split(';')[0];
    const r1 = await request(app).post('/api/auth/refresh').set('Cookie', cookie).send();
    expect(r1.status).toBe(200);
    expect(r1.body.accessToken).toBeTruthy();
    const setCookie2 = r1.headers['set-cookie'];
    expect(setCookie2 && setCookie2.some(s => s.includes('refreshToken='))).toBe(true);

    // old token should be revoked in DB
    const old = await RefreshToken.findOne({ token: originalToken });
    expect(old.revoked).toBe(true);

    // new token stored
    const newCookie = setCookie2[0].split(';')[0];
    const newCookieToken = newCookie.split('=')[1];
    const newStored = await RefreshToken.findOne({ token: newCookieToken });
    expect(newStored).toBeTruthy();
    expect(newStored.revoked).toBe(false);

    // logout should revoke current token and clear cookie
    const r2 = await request(app).post('/api/auth/logout').set('Cookie', newCookie).send();
    expect(r2.status).toBe(200);
    // token in DB should be marked revoked
    const after = await RefreshToken.findOne({ token: newCookieToken });
    expect(after.revoked).toBe(true);

    // attempting refresh with the revoked cookie should fail
    const r3 = await request(app).post('/api/auth/refresh').set('Cookie', newCookie).send();
    expect(r3.status).toBe(401);
  });
});
