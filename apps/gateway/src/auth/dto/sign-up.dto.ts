import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
    required: true,
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!@#',
    description: '비밀번호 (8자 이상, 대소문자, 숫자, 특수문자 포함)',
    required: true,
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;
}
