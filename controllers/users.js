const http2 = require('node:http2');
const user = require('../models/user');
const logger = require('../utils/logger');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
} = http2.constants;

// Получить всех пользователей
const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(HTTP_STATUS_OK).json(users))
    .catch((err) => {
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Получить пользователя по _id
const getUserById = (req, res) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_STATUS_OK).json(getUserId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id' });
      }
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Создать пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then((addUser) => res.status(HTTP_STATUS_CREATED).json(addUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateUser) => {
      if (updateUser) {
        res.status(HTTP_STATUS_OK).json(updateUser);
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      // тут может быть ошибка в github test
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateAvatarUser) => {
      if (updateAvatarUser) {
        res.status(HTTP_STATUS_OK).json(updateAvatarUser);
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      logger.error(`Error in getCards: ${err}`);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
