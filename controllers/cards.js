// файл контроллеров

const mongoose = require('mongoose');
const Card = require('../models/card');

const ERROR_UNEXPECTED = 500;

const { ValidationError, CastError } = mongoose.Error;

const NotFoundError = require('../errors/NotFound'); // 404 code
const BadRequestError = require('../errors/BadRequest'); // 400 code

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
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

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Карточка с такими данными не найдена'));
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.putLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};

module.exports.putDislikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        res
          .status(ERROR_UNEXPECTED)
          .send({ message: `Произошла неизвестная ошибка: ${err.message} ` });
      }
    });
};
