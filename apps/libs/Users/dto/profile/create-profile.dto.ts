import { User } from 'apps/users/src/infrastructure/entity/User.entity';
import { IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  username: string;
  user: User;
}
