// файл контроллеров
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorAuthorization = require('../errors/errorAuthorization');
const ErrorValidation = require('../errors/errorValidation');
const ErrorSameEmail = require('../errors/errorSameEmail');
const ErrorNotFound = require('../errors/errorNotFound');

const { SECRET_KEY = 'tokenkey' } = process.env;

const { ValidationError, CastError } = mongoose.Error;

const {
  SUCCESS_CODE, SAME_OBJECT_CODE,
} = require('../codes/codes');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword, // записываем хеш в базу
    }))
  // Не передаём пароль в ответе
    .then(() => res.status(SUCCESS_CODE).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else if (err.code === SAME_OBJECT_CODE) {
        next(new ErrorSameEmail('Такой e-mail уже зарегистрирован'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new ErrorAuthorization('Пользователь с таким email-ом не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            // аутентификация успешна
            const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
            res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            });
            // вернём токен
            res.send({ token });
          } else {
            throw new ErrorAuthorization('Неверный пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};
