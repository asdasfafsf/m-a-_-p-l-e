import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: '관리자 이메일',
    type: String,
    format: 'email',
    required: true,
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '관리자 비밀번호 (8자 이상, 대소문자, 숫자, 특수문자 포함)',
    type: String,
    required: true,
    example: 'Admin123!@#',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;
}
