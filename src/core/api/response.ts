// Mirrors the backend's success_response() / error_response() envelope exactly.

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  // exactOptionalPropertyTypes needs "| undefined" explicitly — the backend
  // envelope always sends this key, sometimes with value null/absent, which
  // callers pass through as an explicit `undefined`, not just an absent key.
  errors?: Record<string, string[]> | undefined;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.success === true;
}

// Thrown in place of a plain Error whenever a mutation/query hits the API's error
// envelope — keeps the field-level `errors` dict alongside `message` so callers can
// map it onto a form (see core/utils/applyServerErrors) instead of only being able
// to show the generic top-level message.
export class ApiRequestError extends Error {
  errors?: Record<string, string[]> | undefined;

  constructor(res: ApiError) {
    super(res.message);
    this.name = "ApiRequestError";
    this.errors = res.errors;
  }
}
