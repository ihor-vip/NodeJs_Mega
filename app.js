require('module-alias/register');
const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require("helmet");
const cors = require('cors');
const http = require('http');
const fileUpload = require('express-fileupload');
const { mongoose } = require('Share/dependencies');
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const socketIO = require('socket.io');

dotenv.config();

const { PORT, MONGO_URL, NODE_ENV, CORS_WHITE_LIST } = require('./config/config');
const { cacheService } = require('./services');
const cronRun = require('./cron-jobs');
const { authRouter, userRouter, socketRouter, chatRouter } = require('./routes');
const swaggerJson = require('./swagger.json');
const ApiError = require('@error');

const app = express();

const server = http.createServer(app);

const io = socketIO(server, { cors: { origin: '*' } });

global.io = io;

io.on('connection', (socket) => socketRouter(io, socket));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL).then(() => {
  console.log('Connection success')
});

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

server.listen(PORT, async () => {
  console.log(`App listen ${PORT}`);

  await cacheService.client.connect();

  cronRun();
});


// TODO
// KISS
// YAGNI
// SOLID
