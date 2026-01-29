import axios, { InternalAxiosRequestConfig } from "axios";
import { authClient } from "../auth-client";
import { BASE_URL } from "../constants";

const httpClient = axios.create({ baseURL: `${BASE_URL}/api` });

// Request interceptor to add authentication token
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get session from better-auth
      const session = await authClient.getSession();

      if (session?.data?.session) {
        // Better-auth stores token in session.token
        // With jwtClient plugin, the token is the JWT token
        const token = session.data.session.token;

        if (token) {
          // Add token to Authorization header
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // If getting session fails, continue without token
      // This allows unauthenticated requests to proceed
      console.warn("Failed to get auth session for request:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
