import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
}
