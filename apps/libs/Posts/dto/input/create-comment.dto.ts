import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  postId: string;
  @ApiHideProperty()
  @IsUUID()
  userId: string;
  @IsString()
  @MinLength(2, { message: 'comment should be not less than 2 characters' })
  @MaxLength(300, {
    message: 'comment should be not longer than 300 characters',
  })
  text: string;
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
