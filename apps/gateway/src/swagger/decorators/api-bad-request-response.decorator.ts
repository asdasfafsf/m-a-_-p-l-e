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
      description: `
      - ${ERROR_CODE_MAP.INVALID_REQUEST}: ${ERROR_MESSAGE_MAP[ERROR_CODE_MAP.INVALID_REQUEST]}
      `,
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
