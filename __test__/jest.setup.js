const { clearDb, connect, disconnect } = require('./mongo.config');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  // jest.setTimeout(700000);
  await connect();
});

/**
 * Clear DB before every single test
 */
beforeEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await disconnect();
})
