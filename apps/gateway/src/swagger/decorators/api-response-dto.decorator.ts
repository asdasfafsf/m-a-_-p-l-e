import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';

export const ApiResponseDto = <TModel extends Type<any>>(
  status: number,
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ResponseDto),
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
