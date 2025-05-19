import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';

export function ApiForbiddenResponse() {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: `
      - ${ERROR_CODE_MAP.FORBIDDEN}: ${ERROR_MESSAGE_MAP[ERROR_CODE_MAP.FORBIDDEN]}
      `,
      schema: {
        example: {
          code: ERROR_CODE_MAP.FORBIDDEN,
          message: ERROR_MESSAGE_MAP.FORBIDDEN,
          data: null,
        },
      },
    }),
  );
}
