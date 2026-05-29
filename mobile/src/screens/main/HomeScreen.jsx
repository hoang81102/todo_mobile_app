import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTodos, useToggleTodo, useDeleteTodo } from "../../hooks/useTodos";
import TodoCard from "../../components/TodoCard";
import FilterBar from "../../components/FilterBar";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ isCompleted: undefined, priority: undefined, category: undefined });

  const { data, isLoading, refetch, isRefetching } = useTodos({ search, ...filters });
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const todos = data?.todos || [];
  const total = data?.total || 0;
  const completedCount = todos.filter((t) => t.is_completed).length;

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-slate-400 text-sm">My Tasks</Text>
            <Text className="text-white text-2xl font-bold">
              {completedCount}/{total} done
            </Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-primary-600 rounded-2xl items-center justify-center"
            onPress={() => navigation.navigate("CreateTodo")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-slate-700 rounded-full mb-4">
          <View
            className="h-2 bg-primary-500 rounded-full"
            style={{ width: total > 0 ? `${(completedCount / total) * 100}%` : "0%" }}
          />
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-surface-card border border-slate-700 rounded-xl px-4 mb-3">
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            className="flex-1 py-3 px-3 text-white text-sm"
            placeholder="Search tasks..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <FilterBar filters={filters} onChange={setFilters} />
      </View>

      {/* Todo List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : todos.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">📋</Text>
          <Text className="text-white text-xl font-semibold mb-2">No tasks yet</Text>
          <Text className="text-slate-400 text-center">Tap the + button to create your first task</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#3b82f6" />
          }
          renderItem={({ item }) => (
            <TodoCard
              todo={item}
              onToggle={() => toggleTodo.mutate(item.id)}
              onPress={() => navigation.navigate("TodoDetail", { todoId: item.id })}
              onDelete={() => deleteTodo.mutate(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}
