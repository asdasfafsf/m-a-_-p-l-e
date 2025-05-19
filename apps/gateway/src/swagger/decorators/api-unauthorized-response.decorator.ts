import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';

export function ApiUnauthorizedResponse() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: `
      - ${ERROR_CODE_MAP.INVALID_TOKEN}: ${ERROR_MESSAGE_MAP[ERROR_CODE_MAP.INVALID_TOKEN]}
      - ${ERROR_CODE_MAP.TOKEN_EXPIRED}: ${ERROR_MESSAGE_MAP[ERROR_CODE_MAP.TOKEN_EXPIRED]}
      `,
      schema: {
        example: {
          code: ERROR_CODE_MAP.INVALID_TOKEN,
          message: ERROR_MESSAGE_MAP.INVALID_TOKEN,
          data: null,
        },
      },
    }),
  );
}
