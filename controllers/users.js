const http2 = require('node:http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
} = http2.constants;

// Получить всех пользователей
const getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.status(HTTP_STATUS_OK).json(users))
    .catch((err) => {
      next(err);
    });
};

// Создать пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((addUser) => res.status(HTTP_STATUS_CREATED).json(addUser))
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_STATUS_OK).json(getUserId);
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  user.findOne({ email }).select('+password')
    .then((users) => {
      if (!users) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Неправильная почта или пароль' });
      }

      return bcrypt.compare(password, users.password)
        .then((matched) => {
          if (!matched) {
            return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Неправильная почта или пароль' });
          }

          const tokenPayload = { _id: users._id };
          const token = jwt.sign(tokenPayload, 'super-strong-secret', { expiresIn: '7d' });
          res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

          return res.status(HTTP_STATUS_OK).json({ message: 'Успешный вход' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers, createUser, updateProfile, updateAvatar, getUserInfo, login,
};
