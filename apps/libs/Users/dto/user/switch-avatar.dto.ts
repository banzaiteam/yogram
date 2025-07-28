import { IsString, IsUUID } from 'class-validator';

export class SwitchAvatarDto {
  @IsUUID()
  id: string;
  @IsString()
  url: string;
}
