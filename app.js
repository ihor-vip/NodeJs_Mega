const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require("helmet");
const cors = require('cors');
const { MONGO_URL, NODE_ENV, CORS_WHITE_LIST } = require('./config/config');
const fileUpload = require('express-fileupload');
const { authRouter, chatRouter, userRouter } = require('./routes');
const swaggerUI = require('swagger-ui-express');
const ApiError = require('@error');

const swaggerJson = require('./swagger.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== 'test') {
  const { mongoose } = require('Share/dependencies');

  mongoose.connect(MONGO_URL).then(() => {
    console.log('Connection success')
  });
}

app.use(fileUpload({}));

if (NODE_ENV === 'local') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(rateLimit(_configureRateLimit()));
app.use(helmet());
app.use(cors(_configureCors()));

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/users', userRouter);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use('*', _notFoundHandler);

app.use(_mainErrorHandler);

function _notFoundHandler(req, res, next) {
  next(new ApiError('Not found', 404));
}

// eslint-disable-next-line no-unused-vars
function _mainErrorHandler(err, req, res, next) {
  res
    .status(err.status || 500)
    .json({
      message: err.message || 'Server error',
      status: err.status,
      data: {}
    });
}

function _configureCors() {
  const whiteListArr = CORS_WHITE_LIST.split(';');

  return {
    origin: (origin, callback) => {
      if (whiteListArr.includes(origin)) {
        return callback(null, true)
      }

      callback(new Error('Not allowed by CORS'))
    }
  }
}

function _configureRateLimit() {
  return {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }
}

module.exports = app;

// TODO
// KISS
// YAGNI
// SOLID
