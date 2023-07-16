const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/\?#\[\]@!$&'()*+,;=]+#?$/,
    validate: {
      validator: (value) => validator.isURL(value, { require_protocol: true }),
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
