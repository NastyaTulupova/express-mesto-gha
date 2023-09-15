const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.putLikeCardById = (req, res) => 
{Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
  .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.putDislikeCardById = (req, res) => {
    Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" })); }