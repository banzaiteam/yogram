import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseProfileDto {
  @Expose()
  id: string;
  @Expose()
  aboutMe: string;
  @Expose()
  username: string;
}

@Exclude()
class UserResponse {
  @Expose()
  url: string;
}

@Exclude()
export class ResponseProfile1Dto {
  @Expose()
  id: string;
  @Expose()
  aboutMe: string;
  @Expose()
  username: string;
  @Expose()
  user: UserResponse;
}
