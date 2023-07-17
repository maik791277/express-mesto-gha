const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cards');

// Валидация запроса на получение всех карточек
router.get('/', cardsController.getCards);

// Валидация запроса на создание карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), cardsController.createCard);

// Валидация запроса на удаление карточки
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardsController.deleteCard);

// Валидация запроса на поставление лайка карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardsController.likeCard);

// Валидация запроса на удаление лайка с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardsController.dislikeCard);

module.exports = router;
