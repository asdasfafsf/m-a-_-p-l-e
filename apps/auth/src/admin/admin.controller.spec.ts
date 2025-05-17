// update-admin-role.dto.spec.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ROLE_MAP } from '../common/constants/role.constant';
import { UpdateAdminRolesDto } from './dto/update-admin-role.dto';

describe('UpdateAdminRolesDto 유효성 검증', () => {
  it('올바른 데이터로 유효성 검증을 통과해야 함', async () => {
    // 케이스 1: role이 ADMIN인 경우
    const dto1 = plainToInstance(UpdateAdminRolesDto, {
      uuid: 'valid-uuid',
      role: ROLE_MAP.ADMIN,
    });
    const errors1 = await validate(dto1);
    expect(errors1.length).toBe(0);

    // 케이스 2: role이 undefined인 경우
    const dto2 = plainToInstance(UpdateAdminRolesDto, {
      uuid: 'valid-uuid',
    });
    const errors2 = await validate(dto2);
    expect(errors2.length).toBe(0);

    // 케이스 3: role이 null인 경우
    const dto3 = plainToInstance(UpdateAdminRolesDto, {
      uuid: 'valid-uuid',
      role: null,
    });
    const errors3 = await validate(dto3);
    expect(errors3.length).toBe(0);
  });

  it('uuid가 비어있으면 유효성 검증에 실패해야 함', async () => {
    // 케이스 1: uuid가 빈 문자열
    const dto1 = plainToInstance(UpdateAdminRolesDto, {
      uuid: '',
      role: ROLE_MAP.ADMIN,
    });
    const errors1 = await validate(dto1);
    expect(errors1.length).toBeGreaterThan(0);
    expect(errors1[0].property).toBe('uuid');

    // 케이스 2: uuid가 없음
    const dto2 = plainToInstance(UpdateAdminRolesDto, {
      role: ROLE_MAP.ADMIN,
    });
    const errors2 = await validate(dto2);
    expect(errors2.length).toBeGreaterThan(0);
    expect(errors2[0].property).toBe('uuid');
  });

  it('uuid가 문자열이 아니면 유효성 검증에 실패해야 함', async () => {
    const dto = plainToInstance(UpdateAdminRolesDto, {
      uuid: 12345,
      role: ROLE_MAP.ADMIN,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('uuid');
  });

  it('role이 ADMIN이 아닌 다른 값이면 유효성 검증에 실패해야 함', async () => {
    // USER 역할 테스트
    const dto1 = plainToInstance(UpdateAdminRolesDto, {
      uuid: 'valid-uuid',
      role: ROLE_MAP.USER,
    });
    const errors1 = await validate(dto1);
    expect(errors1.length).toBeGreaterThan(0);
    expect(errors1[0].property).toBe('role');

    // 임의의 문자열 테스트
    const dto2 = plainToInstance(UpdateAdminRolesDto, {
      uuid: 'valid-uuid',
      role: 'INVALID_ROLE',
    });
    const errors2 = await validate(dto2);
    expect(errors2.length).toBeGreaterThan(0);
    expect(errors2[0].property).toBe('role');
  });
});
