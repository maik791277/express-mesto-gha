const card = require('../models/card');

const getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(200).json(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card.create({ name, link, owner })
    .then((addCard) => res.status(201).json(addCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(400).send({ message: 'Карточка с указанным _id не найдена' });
      }

      return res.status(200).json({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(500).send({ message: err.message });
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
        res.status(200).json(getLikeCard);
      } else {
        res.status(400).json({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(500).send({ message: err.message });
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
        res.status(200).json(getDislikeCard);
      } else {
        res.status(400).json({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
