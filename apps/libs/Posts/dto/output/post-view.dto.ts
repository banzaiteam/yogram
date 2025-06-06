import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID, Length } from 'class-validator';

export class PostViewModel {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(0, 500)
  description: string;

  @ApiProperty({ type: String })
  @IsDate()
  createdAt: string;

  @ApiProperty({ type: String })
  @IsDate()
  updatedAt: string;
}
