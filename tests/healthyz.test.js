import chai from 'chai';
import { expect } from 'chai';
import request from 'supertest';
import app from '../app/app.js';
import { endStatsd } from '../app/statsd/statsd.js';
// import { getStatsd, endStatsd } from '../statsd/statsd.js'; // Import the middleware functions


describe('Health Controller', function () {
  describe('GET /healthz', function () {
    it('should return a success code (200)', function (done) {
      request(app)
        .get('/healthz')
        .expect(200) // Expect a status code of 200
        .end(function (err, res) {
          if (err) return done(err);
          endStatsd()(null, null, done);
          // done();
        });
    });
  });
});
