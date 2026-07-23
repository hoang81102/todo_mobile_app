import { api } from "./client";
import * as SecureStore from "expo-secure-store";

export const authApi = {
  register: async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  login: async ({ email, password }) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { access_token } = res.data;
    await SecureStore.setItemAsync("access_token", access_token);
    return res.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access_token");
  },

  getMe: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  updateMe: async (data) => {
    const res = await api.put("/api/auth/me", data);
    return res.data;
  },
};
