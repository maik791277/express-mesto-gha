const http2 = require('node:http2');
const card = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN
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
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }

      if (foundCard.owner.toString() !== userId) {
        return res.status(HTTP_STATUS_FORBIDDEN).json({ message: 'Вы не можете удалить чужую карточку' });
      }

      return card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          if (!deletedCard) {
            return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
          }

          return res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
        })
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
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
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
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
