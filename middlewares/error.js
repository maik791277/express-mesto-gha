const http2 = require('node:http2');
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

  logger.error(`Error in updateProfile: ${err}`);
  return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};

module.exports = errorMiddleware;
