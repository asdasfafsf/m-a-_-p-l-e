import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('local', 'dev', 'prod').required(),
  SERVER_PORT: Joi.number().required(),
});
