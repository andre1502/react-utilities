export const EnvironmentEnum = {
  DEV: 'dev',
  QAT: 'qat',
  STAGING: 'staging',
  UAT: 'uat',
  PRODUCTION: 'production',
} as const;

export type EnvironmentEnum =
  (typeof EnvironmentEnum)[keyof typeof EnvironmentEnum];
