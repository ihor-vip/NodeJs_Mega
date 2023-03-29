const request = require('supertest');
const app = require('../../../app');
const createUser = require('../helpers/create-user');

const loginEndpoint = '/auth/login';

const loginData = {
  email: 'email@email.com',
  password: 'P@ssw0rd'
}

describe('Login user', () => {
  it('should return error empty body', async () => {
    const response = await request(app).post(loginEndpoint)
      .set({ origin: 'http://localhost:3000' })
      .send({})


    expect(response.statusCode).toBe(500);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message).toBe('"email" is required');
  });

  it('should login success', async () => {
    await createUser(loginData);

    const response = await request(app)
      .post(loginEndpoint)
      .set({ origin: 'http://localhost:3000' })
      .send(loginData);

    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.access_token).toBe('string');
    expect(typeof response.body.refresh_token).toBe('string');
    expect(response.body.access_token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).toBe(true);
    expect(response.body.refresh_token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).toBe(true);
  });

});
