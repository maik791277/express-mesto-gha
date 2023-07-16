const http2 = require('node:http2');
const card = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN,
} = http2.constants;

const getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).json(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card.create({ name, link, owner })
    .then((addCard) => res.status(HTTP_STATUS_CREATED).json(addCard))
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  card.findById(cardId)
    .then((foundCard) => {
      if (!foundCard) {
        const error = new Error('Карточка с указанным _id не найдена');
        error.status = HTTP_STATUS_NOT_FOUND;
        throw error;
      }

      if (foundCard.owner.toString() !== userId) {
        const error = new Error('Вы не можете удалить чужую карточку');
        error.status = HTTP_STATUS_FORBIDDEN;
        throw error;
      }
      return card.deleteOne({ _id: cardId });
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        const error = new Error('Карточка с указанным _id не найдена');
        error.status = HTTP_STATUS_NOT_FOUND;
        throw error;
      }

      return res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      next(err);
    });
};

// Поставить лайк карточке
const likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((getLikeCard) => {
      if (getLikeCard) {
        res.status(HTTP_STATUS_OK).json(getLikeCard);
      } else {
        const error = new Error('Карточка с указанным _id не найдена');
        error.status = HTTP_STATUS_NOT_FOUND;
        throw error;
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((getDislikeCard) => {
      if (getDislikeCard) {
        res.status(HTTP_STATUS_OK).json(getDislikeCard);
      } else {
        const error = new Error('Карточка с указанным _id не найдена');
        error.status = HTTP_STATUS_NOT_FOUND;
        throw error;
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
