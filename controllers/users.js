// файл контроллеров
const mongoose = require('mongoose');
const User = require('../models/user');

const ERROR_UNEXPECTED = 500;

const { ValidationError, CastError } = mongoose.Error;

const NotFoundError = require('../errors/NotFound'); // 404 code
const BadRequestError = require('../errors/BadRequest'); // 400 code

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  // TODO сделать проверка что боди не пусто

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      } else if (err.name === 'NotFound') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else if (err.name === 'NotFound') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};
