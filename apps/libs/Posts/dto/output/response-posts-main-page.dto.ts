import { ApiProperty } from '@nestjs/swagger';
import { ResponsePostDto } from './response-post.dto';

export class ResponsePostsMainPage {
  posts: ResponsePostDto[];
  usersAmount: number;
  @ApiProperty({ required: false })
  subscribers?: number;
  @ApiProperty({ required: false })
  subscriptions?: number;
}
