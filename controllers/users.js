// файл контроллеров
const User = require('../models/user');

const { ERROR_UNEXPECTED, ERROR_VALIDATION, ERROR_NOT_FOUND } = require('../errors/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // TODO сделать проверка что боди не пусто

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('NotFoundError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFoundError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_VALIDATION)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.message === 'NotFoundError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_VALIDATION)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      } else if (err.message === 'NotFoundError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};
