import { IsString, IsUUID } from 'class-validator';

export class UserAvatarDto {
  @IsUUID()
  id: string;
  @IsString()
  url: string;
}
