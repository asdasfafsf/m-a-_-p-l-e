import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';

export const ApiResponseDto = <TModel extends Type<any> | [Type<any>]>(
  status: number,
  model?: TModel,
) => {
  // model이 [Class] 형태로 들어오면 배열 모드로 전환
  const isArray = Array.isArray(model);
  const itemModel = isArray
    ? (model as Type<any>[])[0]
    : (model as Type<any> | undefined);

  const decorators = [ApiExtraModels(ResponseDto)];

  if (itemModel) {
    decorators.push(ApiExtraModels(itemModel));
  }

  decorators.push(
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          itemModel
            ? {
                properties: {
                  data: isArray
                    ? {
                        type: 'array',
                        items: { $ref: getSchemaPath(itemModel) },
                      }
                    : { $ref: getSchemaPath(itemModel) },
                },
              }
            : {},
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
};
