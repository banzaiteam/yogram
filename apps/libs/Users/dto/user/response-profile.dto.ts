import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseProfileDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
}
