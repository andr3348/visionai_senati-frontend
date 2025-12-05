import { apiClient, setAccessToken, getAccessToken } from "@/lib/api-client";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

export const authService = {
  /**
   * Login user and store token in memory
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Store access token in memory
    setAccessToken(response.data.access_token);

    // Refresh token is automatically stored as HTTP-only cookie by the server

    // Get current user info
    const user = await this.getCurrentUser();
    return user;
  },

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      credentials
    );

    // Store access token in memory
    setAccessToken(response.data.access_token);

    // Get current user info
    const user = await this.getCurrentUser();
    return user;
  },

  /**
   * Logout user by clearing tokens
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout to invalidate refresh token
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local token
      setAccessToken("");
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/users/me");
    return response.data;
  },

  /**
   * Check if user has valid session
   * On page load, if access token is missing, try to refresh it first
   */
  async checkAuth(): Promise<User | null> {
    try {
      // If no access token in memory, try to refresh from HTTP-only cookie
      if (!getAccessToken()) {
        try {
          // Use axios directly to bypass interceptor (prevent infinite loop)
          const response = await apiClient.post<AuthResponse>(
            "/auth/refresh",
            {},
            {
              // This marks the request to skip the retry interceptor
              headers: { "X-Skip-Interceptor": "true" },
            }
          );
          setAccessToken(response.data.access_token);
        } catch (refreshError) {
          // If refresh fails, user is not authenticated
          return null;
        }
      }

      // Now try to get current user
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      return null;
    }
  },
};
