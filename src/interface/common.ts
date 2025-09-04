
export interface IGenericResponse<T> {
  success: boolean;
  data: T;
  meta: Record<string, any>;
  message?: string;
}