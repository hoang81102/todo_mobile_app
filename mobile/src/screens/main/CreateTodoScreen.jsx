import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCreateTodo } from "../../hooks/useTodos";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../../constants";

export default function CreateTodoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const createTodo = useCreateTodo();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    due_date: null,
  });

  const handleCreate = async () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    try {
      await createTodo.mutateAsync(form);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.detail || "Failed to create todo");
    }
  };

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1">New Task</Text>
        <TouchableOpacity
          className="bg-primary-600 px-4 py-2 rounded-xl"
          onPress={handleCreate}
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
        {/* Title */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm font-medium mb-2">Title *</Text>
          <TextInput
            className="bg-surface-card border border-slate-700 rounded-xl px-4 py-4 text-white text-lg"
            placeholder="What needs to be done?"
            placeholderTextColor="#475569"
            value={form.title}
            onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm font-medium mb-2">Description</Text>
          <TextInput
            className="bg-surface-card border border-slate-700 rounded-xl px-4 py-4 text-white text-base"
            placeholder="Add details..."
            placeholderTextColor="#475569"
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
        </View>

        {/* Priority */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm font-medium mb-3">Priority</Text>
          <View className="flex-row gap-2">
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <TouchableOpacity
                key={key}
                className={`flex-1 py-3 rounded-xl items-center border ${
                  form.priority === key
                    ? "border-transparent"
                    : "border-slate-700 bg-surface-card"
                }`}
                style={form.priority === key ? { backgroundColor: cfg.color + "33", borderColor: cfg.color } : {}}
                onPress={() => setForm((p) => ({ ...p, priority: key }))}
              >
                <Text className="text-lg mb-1">{cfg.icon}</Text>
                <Text style={{ color: form.priority === key ? cfg.color : "#64748b" }} className="text-xs font-medium">
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View className="mb-8">
          <Text className="text-slate-400 text-sm font-medium mb-3">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <TouchableOpacity
                key={key}
                className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${
                  form.category === key ? "" : "bg-surface-card border border-slate-700"
                }`}
                style={form.category === key ? { backgroundColor: cfg.color + "33", borderWidth: 1, borderColor: cfg.color } : {}}
                onPress={() => setForm((p) => ({ ...p, category: key }))}
              >
                <Text>{cfg.icon}</Text>
                <Text style={{ color: form.category === key ? cfg.color : "#64748b" }} className="text-sm font-medium">
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
