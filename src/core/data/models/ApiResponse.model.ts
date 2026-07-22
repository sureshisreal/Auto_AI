export interface ApiResponse<T> {
  status: number;
  ok: boolean;
  body: T;
}
