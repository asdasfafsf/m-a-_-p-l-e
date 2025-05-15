export const RESPONSE_CODE_MAP = {
  SUCCESS: 'SUCCESS', // 성공
  ERROR: 'ERROR', // 알 수 없는 오류
  UNAUTHORIZED: 'UNAUTHORIZED', // 인증 실패
  FORBIDDEN: 'FORBIDDEN', // 권한 없음
  NOT_FOUND: 'NOT_FOUND', // 존재하지 않음
  VALIDATION_ERROR: 'VALIDATION_ERROR', // 유효성 검사 실패
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // 서버 오류
  BAD_REQUEST: 'BAD_REQUEST', // 잘못된 요청
} as const;
