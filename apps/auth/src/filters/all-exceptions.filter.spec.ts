// all-exceptions.filter.spec.ts
import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ERROR_CODE_MAP } from '../common/errors/constants/error.constant';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    // Mock response 객체 생성
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock ArgumentsHost 생성
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as any;
  });

  it('MapleHttpException이 발생하면 코드와 메시지를 응답해야 함', () => {
    // Arrange
    const errorCode = ERROR_CODE_MAP.INVALID_TOKEN;
    const errorMessage = '유효하지 않은 토큰입니다.';
    const exception = new MapleHttpException(
      { code: errorCode, message: errorMessage },
      HttpStatus.UNAUTHORIZED,
    );

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: errorCode,
      message: errorMessage,
      data: null,
    });
  });

  it('BadRequestException이 발생하면 INVALID_REQUEST 코드로 응답해야 함', () => {
    // Arrange
    const errorMessage = '잘못된 요청입니다.';
    const exception = new BadRequestException(errorMessage);

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: ERROR_CODE_MAP.INVALID_REQUEST,
      message: errorMessage,
      data: null,
    });
  });

  it('HttpException 메시지가 문자열이면 해당 메시지로 응답해야 함', () => {
    // Arrange
    const errorMessage = '정의되지 않은 오류입니다.1';
    const exception = new HttpException(errorMessage, HttpStatus.BAD_GATEWAY);

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert

    expect(mockResponse.json).toHaveBeenCalledWith({
      code: ERROR_CODE_MAP.ERROR,
      message: errorMessage,
      data: null,
    });
  });

  it('HttpException 메시지가 배열이면 첫 번째 메시지로 응답해야 함', () => {
    // Arrange
    const errorMessages = ['첫 번째 오류', '두 번째 오류'];
    const exception = new HttpException(
      { message: errorMessages },
      HttpStatus.BAD_REQUEST,
    );

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: ERROR_CODE_MAP.ERROR,
      message: errorMessages[0],
      data: null,
    });
  });

  it('정의되지 않은 예외가 발생하면 기본 오류 메시지로 응답해야 함', () => {
    // Arrange
    const exception = new Error('예상치 못한 오류');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: 'ERROR',
      message: '정의되지 않은 오류입니다.',
      data: null,
    });
  });
});
