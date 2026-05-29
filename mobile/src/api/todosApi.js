import { api } from "./client";

export const todosApi = {
  getAll: async ({ page = 1, pageSize = 20, isCompleted, priority, category, search } = {}) => {
    const params = { page, page_size: pageSize };
    if (isCompleted !== undefined) params.is_completed = isCompleted;
    if (priority) params.priority = priority;
    if (category) params.category = category;
    if (search) params.search = search;
    const res = await api.get("/api/todos", { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/todos/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/api/todos", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/api/todos/${id}`, data);
    return res.data;
  },

  toggle: async (id) => {
    const res = await api.patch(`/api/todos/${id}/toggle`);
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/todos/${id}`);
  },
};
