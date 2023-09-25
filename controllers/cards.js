// файл контроллеров

const Card = require('../models/card');
const ErrorForbidden = require('../errors/errorForbidden');
const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');

const { SUCCESS_CODE } = require('../codes/codes');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new ErrorNotFound('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.deleteOne(card)
          .then((cards) => res.send(cards))
          .catch(next);
      } else {
        throw new ErrorForbidden('Вы не автор данной карточки');
      }
    })
    .catch(next);
};

module.exports.putLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('NotFoundError'))
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        next(res.send(card));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.putDislikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        next(res.send(card));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};
