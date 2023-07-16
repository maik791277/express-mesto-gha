const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cards');

// Получить все карточки
router.get('/', cardsController.getCards);

// Создать карточку
router.post('/', cardsController.createCard);

// Удаления карточки
router.delete('/:cardId', cardsController.deleteCard);

// Поставить лайк карточке
router.put('/:cardId/likes', cardsController.likeCard);

// Убрать лайк с карточки
router.delete('/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
