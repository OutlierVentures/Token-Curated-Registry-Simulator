const request = require('supertest');

const app = require('../app');

describe('GET /', () => {
  after(() => {
    app.close();
  });
  it('should respond with Hello World!', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello World!', done);
  });
});
