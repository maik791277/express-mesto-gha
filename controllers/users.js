const user = require('../models/user');

// Получить всех пользователей
const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Получить пользователя по _id
const getUserById = (req, res) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        return res.status(404).json({ error: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).json(getUserId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Создать пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then((addUser) => res.status(201).json(addUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((updateUser) => {
      if (updateUser) {
        res.status(200).json(updateUser);
      } else {
        res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: err.message });
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
      upsert: true,
    },
  )
    .then((updateAvatarUser) => {
      if (updateAvatarUser) {
        res.status(200).json(updateAvatarUser);
      } else {
        res.status(404).json({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
