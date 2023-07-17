const jwt = require('jsonwebtoken');
const http2 = require('node:http2');
const { ClientError } = require('../class/ClientError');

const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  if (!token) {
    return next(new ClientError('Необходима авторизация', HTTP_STATUS_UNAUTHORIZED));
  }
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new ClientError('Необходима авторизация', HTTP_STATUS_UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};
