const jwt = require('jsonwebtoken');
const ErrorAuthorization = require('../errors/errorAuthorization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorAuthorization('Необходима авторизация'));
  }

  let payload;
  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, 'tokenkey');
  } catch (err) {
    next(new ErrorAuthorization('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
