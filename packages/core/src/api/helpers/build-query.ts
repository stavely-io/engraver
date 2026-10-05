import { ObjectQueryParameters } from '../types/api.types';

export function buildQuery(params: ObjectQueryParameters = {}): string {
  const query = new URLSearchParams();

  for (const key in params) {
    const value = params[key];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((element) => {
        query.append(key, String(element));
      });
    } else {
      query.append(key, String(value));
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
