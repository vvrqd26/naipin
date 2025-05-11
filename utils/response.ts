export type BaseResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

export function ok<T>(data: T, message?: string) {
  return new Response(
    JSON.stringify({
      data,
      message,
      status: 0,
    }),
  );
}

export function error<T>(
  data: T,
  status = 1,
  message?: string,
) {
  return new Response(
    JSON.stringify({
      data,
      message,
      status,
    }),
  );
}
