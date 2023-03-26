require('module-alias/register');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { PORT, MONGO_URL, NODE_ENV } = require('./config/config');
const { authRouter, userRouter } = require('./routes');
const ApiError = require('@error');

const app = express();

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

app.use('/auth', authRouter);
app.use('/users', userRouter);
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

app.listen(PORT, () => {
  console.log(`App listen ${PORT}`);
});


// TODO
// KISS
// YAGNI
// SOLID
