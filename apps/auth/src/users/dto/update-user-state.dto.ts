import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { USER_STATE_MAP } from '../constants/user.constant';
import { UserState } from '../types/user.type';

export class UpdateUserStateDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsIn(Object.values(USER_STATE_MAP))
  state: UserState;
}
