import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';

export function ApiBadRequestResponse() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'INVALID_REQUEST: 잘못된 요청입니다.',
      schema: {
        example: {
          code: ERROR_CODE_MAP.INVALID_REQUEST,
          message: ERROR_MESSAGE_MAP.INVALID_REQUEST,
          data: null,
        },
      },
    }),
  );
}
