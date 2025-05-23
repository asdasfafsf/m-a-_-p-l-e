import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('local', 'dev', 'prod').required(),
  SERVER_PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  AUTH_SERVER_URL: Joi.string().uri().required(),
  EVENT_SERVER_URL: Joi.string().uri().required(),
});
