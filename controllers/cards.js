const http2 = require('node:http2');
const card = require('../models/card');
const { ClientError } = require('../class/ClientError');

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
        throw new ClientError('Карточка с указанным _id не найдена', HTTP_STATUS_NOT_FOUND);
      }

      if (foundCard.owner.toString() !== userId) {
        throw new ClientError('Вы не можете удалить чужую карточку', HTTP_STATUS_FORBIDDEN);
      }
      return card.deleteOne({ _id: cardId });
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new ClientError('Карточка с указанным _id не найдена', HTTP_STATUS_NOT_FOUND);
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
        throw new ClientError('Карточка с указанным _id не найдена', HTTP_STATUS_NOT_FOUND);
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
        throw new ClientError('Карточка с указанным _id не найдена', HTTP_STATUS_NOT_FOUND);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
