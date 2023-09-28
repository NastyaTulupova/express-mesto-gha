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
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateUserProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
