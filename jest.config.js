module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "@error": "<rootDir>/error/apiError.js",
    "@middlewares/(.*)": "<rootDir>/middlewares/$1",
    "@middlewares": "<rootDir>/middlewares/index.js"
  },
  globalSetup: "<rootDir>/__test__/env.setup.js",
  setupFilesAfterEnv: ["<rootDir>/__test__/jest.setup.js"]
}
