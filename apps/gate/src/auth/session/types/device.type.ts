export type Device = {
  deviceId: string;
  ip: string;
  // active: boolean;
  userId: string;
  current?: boolean;
  lastSeen?: string;
};
