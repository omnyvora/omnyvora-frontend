// Mirrors the backend's success_response() / error_response() envelope exactly.

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.success === true;
}
