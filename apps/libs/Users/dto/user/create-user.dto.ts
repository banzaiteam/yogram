import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'username should be 6-30 characters length and unique',
  })
  @IsString()
  @MinLength(6, {
    message: 'username must be longer than or equal to 6 characters',
  })
  @MaxLength(30)
  username: string;

  @ApiProperty({
    description: 'email should be unique',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 4,
    maxLength: 30,
    description:
      'password should be 4-30 characters length and have at least 1 number, 1 lowerCase, 1 upperCase and 1 symbol',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'aboutMe should be minimum 20 and max 200 characters long',
  })
  @IsOptional()
  @IsString()
  @MinLength(20, {
    message: 'aboutMe should be minimum 20 and max 200 characters long',
  })
  @MaxLength(200, {
    message: 'aboutMe should be minimum 20 and max 200 characters long',
  })
  aboutMe?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  file?: any; // Type 'any' for Swagger's binary format representation
}
