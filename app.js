const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { PORT, MONGO_URL } = require('./config/config');
const { userRouter } = require('./routes');
const ApiError = require('./error/ApiError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL).then(() => {
  console.log('Connection success')
})

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
// TODO OPTIONAL
// SOLID
