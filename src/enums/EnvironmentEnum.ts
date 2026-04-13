export const EnvironmentEnum = {
  DEV: 'dev',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type EnvironmentEnum =
  (typeof EnvironmentEnum)[keyof typeof EnvironmentEnum];
