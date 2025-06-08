import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseDeviceDto {
  @Expose()
  deviceId: string;
  @Expose()
  ip: string;
  @Expose()
  lastSeen: string;
  @Expose()
  current?: boolean;
}
