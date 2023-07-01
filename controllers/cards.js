const http2 = require('node:http2');
const card = require('../models/card');
const logger = require('../utils/logger');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
} = http2.constants;

const getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).json(cards))
    .catch((err) => {
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card.create({ name, link, owner })
    .then((addCard) => res.status(HTTP_STATUS_CREATED).json(addCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании' });
      }
      logger.error(`Error in createCard: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }

      return res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      }
      logger.error(`Error in deleteCard: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((getLikeCard) => {
      if (getLikeCard) {
        res.status(HTTP_STATUS_OK).json(getLikeCard);
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      }
      logger.error(`Error in likeCard: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((getDislikeCard) => {
      if (getDislikeCard) {
        res.status(HTTP_STATUS_OK).json(getDislikeCard);
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      }
      logger.error(`Error in dislikeCard: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
