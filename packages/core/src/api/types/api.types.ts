export type ObjectQueryParameters = Record<string, string | number | boolean | string[] | number[]>;

export enum ApiEnvironment {
  DEV = 'dev',
  STAGE = 'stage',
  PROD = 'prod',
}
