import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SERVER_PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('local', 'production').default('local'),
});
