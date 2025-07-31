import { ResponsePostDto } from './response-post.dto';

export class ResponsePostsMainPage {
  posts: ResponsePostDto[];
  usersAmount: number;
  subscribers?: number;
  subscriptions?: number;
}
