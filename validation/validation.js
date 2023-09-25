const { celebrate, Joi } = require('celebrate');

const regex = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,\/;=]{2,256}\.[a-zA-Z0-9.\/?#-]{2,}$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(regex).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
});

const validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex).required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regex).required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateUpdateUserProfile,
  validateUpdateUserAvatar,
  validateCreateCard,
  validateCardId,
};
