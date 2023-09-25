// файл маршрутов
const router = require('express').Router();
const {
  createCard, getCards, deleteCardById, putLikeCardById, putDislikeCardById,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../validation/validation');

router.post('/', validateCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCardById);
router.put('/:cardId/likes', validateCardId, putLikeCardById);
router.delete('/:cardId/likes', validateCardId, putDislikeCardById);

module.exports = router;
