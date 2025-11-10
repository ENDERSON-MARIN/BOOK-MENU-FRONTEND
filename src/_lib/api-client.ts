import { AppError } from "@/_errors/AppError";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiBaseUrl}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      errorData?.message || "Ocorreu um erro na chamada da API.",
      response.status,
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as T;
}
