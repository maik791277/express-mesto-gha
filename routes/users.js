const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users');

// Получить всех пользователей
router.get('/', usersController.getUsers);

// Получить пользователя по _id
router.get('/:userId', usersController.getUserById);

// Создать пользователя
router.post('/', usersController.createUser);

// Обновления профиля пользовтеля
router.patch('/me', usersController.updateProfile);

// Обновить аватар пользователя
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
