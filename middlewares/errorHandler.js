const { ERROR_UNEXPECTED } = require('../codes/codes');

const errorHandler = (err, req, res, next) => {
  const { statusCode = ERROR_UNEXPECTED, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === ERROR_UNEXPECTED
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = errorHandler;
