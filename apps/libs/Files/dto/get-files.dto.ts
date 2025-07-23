import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetFilesUrlDto {
  @Expose()
  url: string;
}
