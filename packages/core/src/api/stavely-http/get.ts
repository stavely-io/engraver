import { APIError } from '@/features/exercises/models/errors/api-error';
import { ApiErrorTranslationService } from '@/features/exercises/models/services/api-error-translation-service';

import { buildQuery } from '../helpers/build-query';
import { getBaseUrl, getEnvironment } from '../helpers/routes';
import { ApiEnvironment } from '../types';
import { ObjectQueryParameters } from '../types/api.types';

export async function get<TResponse>(
  path: string,
  params?: ObjectQueryParameters,
  options?: RequestInit,
): Promise<TResponse> {
  const env = getEnvironment();
  const base = getBaseUrl();
  const query = buildQuery(params);
  const url = `${base}${path}${query}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (env === ApiEnvironment.STAGE) {
    const stageToken = process.env.NEXT_PUBLIC_STAGE_ACCESS_TOKEN;
    if (!stageToken) {
      throw new Error('Stage access token not defined in env variables.');
    }
    headers['X-Stage-Access'] = stageToken;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers,
    ...options,
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      const text = await res.text();
      throw new Error(`GET ${url} failed with non-JSON response: ${text}`);
    }
    if (ApiErrorTranslationService.isAPIError(errorData)) throw new APIError(errorData.code, errorData.data);
    throw new Error(`GET ${url} failed with JSON response: ${JSON.stringify(errorData)}}`);
  }

  return res.json() as Promise<TResponse>;
}
