// файл маршрутов
const router = require('express').Router();
const {
  createCard, getCards, deleteCardById, putLikeCardById, putDislikeCardById,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', putLikeCardById);
router.delete('/:cardId/likes', putDislikeCardById);

module.exports = router;
