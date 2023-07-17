const http2 = require('node:http2');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const { errorMiddleware } = require('./middlewares/error');
const routes = require('./routes');
const { ClientError } = require('./class/ClientError');

const {
  HTTP_STATUS_NOT_FOUND,
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
    avatar: Joi.string().uri().regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/).optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(cookieParser());
app.use(authMiddleware);
app.use('/', routes);
app.use(errors());
app.use((req, res, next) => next(new ClientError('Страница не найдена', HTTP_STATUS_NOT_FOUND)));
app.use(errorMiddleware);

app.listen(PORT);
