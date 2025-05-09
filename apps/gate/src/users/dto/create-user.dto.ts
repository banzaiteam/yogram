import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;
  // @IsDate()
  birthdate: Date;
  @IsEmail()
  email: string;
  @ApiProperty({
    minLength: 4,
    maxLength: 30,
    description:
      'password should have at least 1 number, 1 lowerCase, 1 upperCase, 1 symbol',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 4,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  city: string;
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  country: string;
}
