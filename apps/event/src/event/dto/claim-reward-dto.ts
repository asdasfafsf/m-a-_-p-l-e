import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClaimRewardDto {
  @IsNotEmpty()
  @IsUUID()
  userUuid: string;
}
