import { ERROR_CODE_MAP } from '../constants/error.constant';

export type ErrorCode = (typeof ERROR_CODE_MAP)[keyof typeof ERROR_CODE_MAP];
