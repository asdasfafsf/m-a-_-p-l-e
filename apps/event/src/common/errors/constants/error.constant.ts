export const ERROR_CODE_MAP = {
  INVALID_CREDENTIAL: 'INVALID_CREDENTIAL',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ERROR: 'ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NOT_FOUND_USER: 'NOT_FOUND_USER',
  CONFLICT_EMAIL: 'CONFLICT_EMAIL',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INACTIVE_USER: 'INACTIVE_USER',
} as const;

export const ERROR_MESSAGE_MAP = {
  [ERROR_CODE_MAP.INVALID_CREDENTIAL]: '유저 정보가 일치하지 않습니다.',
  [ERROR_CODE_MAP.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ERROR_CODE_MAP.TOKEN_EXPIRED]: '토큰이 만료되었습니다.',
  [ERROR_CODE_MAP.ERROR]: '오류가 발생했습니다.',
  [ERROR_CODE_MAP.NOT_FOUND]: '존재하지 않는 리소스입니다.',
  [ERROR_CODE_MAP.NOT_FOUND_USER]: '존재하지 않는 유저입니다.',
  [ERROR_CODE_MAP.CONFLICT_EMAIL]: '이미 존재하는 이메일입니다.',
  [ERROR_CODE_MAP.INVALID_PARAMETER]: '유효하지 않은 파라미터입니다.',
  [ERROR_CODE_MAP.INVALID_REQUEST]: '유효하지 않은 요청입니다.',
  [ERROR_CODE_MAP.INACTIVE_USER]: '비활성화된 유저입니다.',
} as const;
