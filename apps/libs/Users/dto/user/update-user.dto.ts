import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'file',
  'id',
]) {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
  @IsOptional()
  @IsString()
  url?: string;
}
