export type Device = {
  deviceId: string;
  ip: string;
  active: boolean;
  expiresAt: number;
  userId: string;
  current?: boolean;
  lastSeen?: string;
};
