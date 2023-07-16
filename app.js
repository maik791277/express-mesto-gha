const http2 = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');
const logger = require('./utils/logger');

const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useUnifiedTopology: true });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().uri().optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(cookieParser());
app.use(authMiddleware);
app.use('/', routes);
app.use(errorMiddleware);
app.use(errors());

app.use((req, res, next) => {
  const error = new Error('Страница не найдена');
  error.status = HTTP_STATUS_NOT_FOUND;
  next(error);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    logger.error(`Error in updateProfile: ${err}`);
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

app.listen(PORT);
