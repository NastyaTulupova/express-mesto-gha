// файл контроллеров
const mongoose = require("mongoose");
const User = require("../models/user");

const ERROR_UNEXPECTED = 500;

const { ValidationError } = mongoose.Error;

const NotFoundError = require("../errors/NotFound"); // 404 code
const BadRequestError = require("../errors/BadRequest"); // 400 code

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // TODO сделать проверка что боди не пусто

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new BadRequestError(
          `Переданы некорректные данные при создании пользователя`
        );
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
      if (err instanceof ValidationError) {
        throw new BadRequestError(`Переданные данные некорректны`);
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "NotFound") {
        throw new NotFoundError(`Пользователь с такими данными не найден`);
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new BadRequestError(
          `Переданы некорректные данные при обновлении аватара`
        );
      } else if (err.name === "NotFound") {
        throw new NotFoundError(`Пользователь с указанным _id не найден`);
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new BadRequestError(
          `Переданы некорректные данные при обновлении профиля`
        );
      } else if (err.name === "NotFound") {
        throw new NotFoundError(`Пользователь с указанным _id не найден`);
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};
