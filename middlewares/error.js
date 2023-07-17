const http2 = require('node:http2');
const { ClientError } = require('../class/ClientError');
const logger = require('../utils/logger');

const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
} = http2.constants;

const errorMiddleware = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).json({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Ошибка авторизации. Некорректный токен' });
  }

  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
  }

  const { status } = err;
  let message;
  if (err instanceof ClientError) {
    message = `Ошибка клиента: ${err.message || 'Что-то пошло не так'}`;
  } else {
    message = err.message || 'Что-то пошло не так';
  }

  if (!err.status || !(err instanceof ClientError)) {
    logger.error(`Error occurred: ${err}`);
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }

  return res.status(status).json({ message });
};
module.exports = {
  errorMiddleware,
};
