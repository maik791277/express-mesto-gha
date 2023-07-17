const { celebrate, Joi, Segments } = require('celebrate');
const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users');

// Валидация запроса на получение всех пользователей
router.get('/', usersController.getUsers);

// Валидация запроса на получение информации о текущем пользователе
router.get('/me', usersController.getUserInfo);

// Валидация запроса на получение пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), usersController.getUserById);

// Валидация запроса на обновление профиля пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), usersController.updateProfile);

// Валидация запроса на обновление аватара пользователя
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/).required(),
  }),
}), usersController.updateAvatar);

module.exports = router;
