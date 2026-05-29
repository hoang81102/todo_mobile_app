import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { todosApi } from "../../api/todosApi";
import { useUpdateTodo, useToggleTodo, useDeleteTodo } from "../../hooks/useTodos";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../../constants";
import { format } from "date-fns";

export default function TodoDetailScreen({ navigation, route }) {
  const { todoId } = route.params;
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const { data: todo, isLoading } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => todosApi.getById(todoId),
  });

  const updateTodo = useUpdateTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  useEffect(() => {
    if (todo) setForm({ title: todo.title, description: todo.description || "", priority: todo.priority, category: todo.category });
  }, [todo]);

  const handleSave = async () => {
    try {
      await updateTodo.mutateAsync({ id: todoId, data: form });
      setEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update todo");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTodo.mutateAsync(todoId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const priorityCfg = PRIORITY_CONFIG[todo?.priority] || PRIORITY_CONFIG.medium;
  const categoryCfg = CATEGORY_CONFIG[todo?.category] || CATEGORY_CONFIG.other;

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1">Task Detail</Text>
        <View className="flex-row gap-3">
          {editing ? (
            <TouchableOpacity onPress={handleSave} disabled={updateTodo.isPending}>
              <Ionicons name="checkmark-circle" size={28} color="#3b82f6" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="pencil" size={24} color="#64748b" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Status banner */}
        <TouchableOpacity
          className={`flex-row items-center gap-3 p-4 rounded-2xl mb-6 ${
            todo?.is_completed ? "bg-emerald-500/20" : "bg-slate-700/50"
          }`}
          onPress={() => toggleTodo.mutate(todoId)}
        >
          <Ionicons
            name={todo?.is_completed ? "checkmark-circle" : "ellipse-outline"}
            size={28}
            color={todo?.is_completed ? "#10b981" : "#64748b"}
          />
          <Text className={`font-semibold text-base ${todo?.is_completed ? "text-emerald-400" : "text-slate-400"}`}>
            {todo?.is_completed ? "Completed" : "Mark as complete"}
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <View className="mb-4">
          <Text className="text-slate-400 text-xs uppercase tracking-widest mb-2">Title</Text>
          {editing ? (
            <TextInput
              className="bg-surface-card border border-primary-500 rounded-xl px-4 py-3 text-white text-lg"
              value={form.title}
              onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
            />
          ) : (
            <Text className={`text-white text-xl font-semibold ${todo?.is_completed ? "line-through opacity-60" : ""}`}>
              {todo?.title}
            </Text>
          )}
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-slate-400 text-xs uppercase tracking-widest mb-2">Description</Text>
          {editing ? (
            <TextInput
              className="bg-surface-card border border-primary-500 rounded-xl px-4 py-3 text-white text-base"
              value={form.description}
              onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          ) : (
            <Text className="text-slate-300 text-base">{todo?.description || "No description"}</Text>
          )}
        </View>

        {/* Meta info */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface-card rounded-2xl p-4">
            <Text className="text-slate-400 text-xs mb-2">Priority</Text>
            <View className="flex-row items-center gap-2">
              <Text>{priorityCfg.icon}</Text>
              <Text style={{ color: priorityCfg.color }} className="font-semibold">
                {priorityCfg.label}
              </Text>
            </View>
          </View>
          <View className="flex-1 bg-surface-card rounded-2xl p-4">
            <Text className="text-slate-400 text-xs mb-2">Category</Text>
            <View className="flex-row items-center gap-2">
              <Text>{categoryCfg.icon}</Text>
              <Text style={{ color: categoryCfg.color }} className="font-semibold">
                {categoryCfg.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Dates */}
        <View className="bg-surface-card rounded-2xl p-4 mb-6">
          <Text className="text-slate-400 text-xs mb-3">Created</Text>
          <Text className="text-white">
            {todo?.created_at ? format(new Date(todo.created_at), "MMM dd, yyyy HH:mm") : "—"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
