import { API_URL } from "@/constants/api-url";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Manejo de refresh concurrente
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Interceptor para agregar token a cada request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores 401 y renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si ya se está haciendo un refresh, encolamos el request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefresh } = response.data;

        await SecureStore.setItemAsync("token", token);
        if (newRefresh) {
          await SecureStore.setItemAsync("refreshToken", newRefresh);
        }

        // Actualizar token en headers por defecto
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        processQueue(null, token);

        // Volver a intentar request original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
