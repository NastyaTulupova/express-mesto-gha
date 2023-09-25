// файл маршрутов
const router = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateUserProfile,
  validateUpdateUserAvatar,
} = require('../validation/validation');

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateUserProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);
router.get('/me', getCurrentUser);

module.exports = router;
