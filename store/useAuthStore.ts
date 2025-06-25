import { API_URL } from "@/constants/api-url";
import api from "@/lib/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  loading: boolean;
  message?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  message: "",

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status < 200 || response.status >= 300)
        throw new Error("Login failed");

      const { token, refreshToken, user } = response.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      set({
        user,
        token,
        refreshToken,
        loading: false,
        message: "Login successful",
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        message: "Login failed",
      });
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    set({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      message: "Logout successful",
    });
  },

  checkAuth: async () => {
    const token = await SecureStore.getItemAsync("token");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const userJson = await SecureStore.getItemAsync("user");

    if (token && userJson && refreshToken) {
      const user: User = JSON.parse(userJson);
      set({
        user,
        token,
        refreshToken,
        loading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
      });
    }
  },
}));
