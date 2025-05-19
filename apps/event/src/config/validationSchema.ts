import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SERVER_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('local', 'prod').required(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
});
