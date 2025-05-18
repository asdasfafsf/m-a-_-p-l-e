import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { RESPONSE_CODE_MAP } from '../common/constants/response-code.constant';
import { ArgumentsHost } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('MapleHttpException 처리', () => {
    it('should handle MapleHttpException correctly', () => {
      const mapleError = new MapleHttpException(
        { code: 'TEST_ERROR', message: '테스트 에러입니다.' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(mapleError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'TEST_ERROR',
        message: '테스트 에러입니다.',
      });
    });
  });

  describe('일반 HttpException 처리', () => {
    it('should handle regular HttpException correctly', () => {
      const httpError = new HttpException(
        '일반 에러입니다.',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(httpError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: RESPONSE_CODE_MAP.ERROR,
        message: '일반 에러입니다.',
      });
    });
  });

  describe('알 수 없는 에러 처리', () => {
    it('should handle unknown errors correctly', () => {
      const unknownError = new Error('알 수 없는 에러');

      filter.catch(unknownError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: RESPONSE_CODE_MAP.ERROR,
        message: '정의되지 않은 오류입니다.',
      });
    });
  });
});
