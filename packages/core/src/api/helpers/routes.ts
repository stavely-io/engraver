import { ApiEnvironment } from '../types';

export function getBaseUrl(): string {
  const env = getEnvironment();

  switch (env) {
    case ApiEnvironment.DEV:
      return process.env.NEXT_PUBLIC_DEV_API_BASE_URL!;
    case ApiEnvironment.STAGE:
      return process.env.NEXT_PUBLIC_STAGE_API_BASE_URL!;
    case ApiEnvironment.PROD:
      return process.env.NEXT_PUBLIC_PROD_API_BASE_URL!;
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
}

export function getEnvironment(): ApiEnvironment {
  if (typeof window === 'undefined') return ApiEnvironment.PROD;
  const host = window.location.hostname;

  if (host.includes('localhost')) return ApiEnvironment.DEV;
  if (host.startsWith('stage.')) return ApiEnvironment.STAGE;
  return ApiEnvironment.PROD;
}
