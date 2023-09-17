const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { ERROR_NOT_FOUND } = require('../codes/codes');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/', (reg, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Произошла непредвиденная ошибка' });
});

module.exports = router;
