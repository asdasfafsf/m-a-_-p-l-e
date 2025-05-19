import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { EventKillMonster } from '../types/event-kill-monster.type';

const monsterKillListSchema = Joi.array()
  .items(
    Joi.object({
      monsterUuid: Joi.string().required().messages({
        'any.required': 'Monster UUID is required',
        'string.empty': 'Monster UUID is required',
      }),
      monsterName: Joi.string().required().messages({
        'any.required': 'Monster name is required',
        'string.empty': 'Monster name is required',
      }),
      killCount: Joi.number().required().messages({
        'any.required': 'Kill count is required',
        'number.base': 'Kill count must be a number',
      }),
    }),
  )
  .min(1)
  .required()
  .messages({
    'array.min': '최소 1개 이상의 항목이 필요합니다',
    'array.base': '유효한 배열이 아닙니다',
    'any.required': '데이터가 필요합니다',
  });

export const validate = (data: EventKillMonster) => {
  const { error } = monsterKillListSchema.validate(data, { abortEarly: false });

  if (error) {
    throw new BadRequestException(error.details[0].message);
  }
};
