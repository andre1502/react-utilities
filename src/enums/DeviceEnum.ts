export const DeviceEnum = {
  PC: 'pc',
  MOBILE: 'mobile',
} as const;

export type DeviceEnum = (typeof DeviceEnum)[keyof typeof DeviceEnum];
