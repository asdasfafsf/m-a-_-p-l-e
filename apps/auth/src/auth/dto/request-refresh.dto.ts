import { IsNotEmpty, IsString } from 'class-validator';

export class RequestRefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
