import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';

export const ApiResponseDto = <TModel extends Type<any>>(
  status: number,
  model?: TModel,
) => {
  const decorators = [];

  decorators.push(ApiExtraModels(ResponseDto));
  if (model) decorators.push(ApiExtraModels(model));

  decorators.push(
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          ...(model
            ? [
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ]
            : []),
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
};
