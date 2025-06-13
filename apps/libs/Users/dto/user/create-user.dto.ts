import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
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
}
