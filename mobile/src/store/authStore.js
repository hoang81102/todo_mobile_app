import { create } from "zustand";
import { authApi } from "../api/authApi";
import * as SecureStore from "expo-secure-store";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Called on app startup to restore session
  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        const user = await authApi.getMe();
        set({ user, isAuthenticated: true });
      }
    } catch {
      await SecureStore.deleteItemAsync("access_token");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    await authApi.login(credentials);
    const user = await authApi.getMe();
    set({ user, isAuthenticated: true });
  },

  register: async (data) => {
    await authApi.register(data);
    await authApi.login({ email: data.email, password: data.password });
    const user = await authApi.getMe();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => set({ user: updatedUser }),
}));
