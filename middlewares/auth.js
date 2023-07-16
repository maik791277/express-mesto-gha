const jwt = require('jsonwebtoken');
const http2 = require('node:http2');

const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;

const handleAuthError = (res) => {
  res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  if (!token) {
    return handleAuthError(res);
  }
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
