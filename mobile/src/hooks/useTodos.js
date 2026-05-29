import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "../api/todosApi";

export const TODOS_KEY = "todos";

export function useTodos(filters = {}) {
  return useQuery({
    queryKey: [TODOS_KEY, filters],
    queryFn: () => todosApi.getAll(filters),
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TODOS_KEY] }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => todosApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TODOS_KEY] }),
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => todosApi.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TODOS_KEY] }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => todosApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TODOS_KEY] }),
  });
}
