const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: ['Жак-Ив Кусто'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: ['Исследователь'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
        default: ['https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'],
      },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: [true, 'Поле "email" должно быть уникально'],
      validate: {
        validator: (v) => validator.email(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    }
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
