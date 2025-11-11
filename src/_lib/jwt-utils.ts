import type { AuthUser } from "@/_types/auth";

/**
 * Decode JWT token and extract user information
 * @param token JWT token string
 * @returns Decoded user information or null if invalid
 */
export function decodeJWT(token: string): AuthUser | null {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsedPayload = JSON.parse(decodedPayload);

    // Extract user information from payload
    return {
      id: parsedPayload.id || parsedPayload.sub,
      cpf: parsedPayload.cpf,
      name: parsedPayload.name,
      role: parsedPayload.role,
      userType: parsedPayload.userType,
      status: parsedPayload.status,
    };
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return true;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsedPayload = JSON.parse(decodedPayload);

    if (!parsedPayload.exp) {
      return false; // No expiration set
    }

    // exp is in seconds, Date.now() is in milliseconds
    return parsedPayload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
