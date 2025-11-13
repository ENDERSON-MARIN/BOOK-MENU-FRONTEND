import { AppError } from "@/_errors/AppError";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiBaseUrl}${endpoint}`;

  // Get JWT token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  // Handle 401 Unauthorized - redirect to login and clear token
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    throw new AppError("Sessão expirada. Faça login novamente.", 401);
  }

  // Handle 403 Forbidden - access denied
  if (response.status === 403) {
    throw new AppError(
      "Acesso negado. Você não tem permissão para realizar esta ação.",
      403,
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      errorData?.error ||
        errorData?.message ||
        "Ocorreu um erro na chamada da API.",
      response.status,
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as T;
}
