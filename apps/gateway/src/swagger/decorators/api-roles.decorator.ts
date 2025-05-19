import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';
/**
 * @ApiOperationWithRoles('이벤트 조회', { summary: '이벤트 리스트 가져오기', tags: ['Event'] }, ['ADMIN','OPERATOR'])
 */
export function ApiOperationWithRoles(
  operationOpts: ApiOperationOptions,
  roles: string[],
) {
  // bullet 리스트용 Markdown
  const rolesMd = roles.map((r) => `- ${r}`).join('\n');
  const description = [
    operationOpts.description, // 기존 description
    `**필요 권한**\n\n${rolesMd}`, // 권한 표시
  ]
    .filter(Boolean)
    .join('\n\n');

  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiOperation({
      ...operationOpts,
      description,
    }),
  );
}
