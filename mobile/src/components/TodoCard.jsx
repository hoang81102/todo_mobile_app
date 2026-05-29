import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../constants";
import { format } from "date-fns";

export default function TodoCard({ todo, onToggle, onPress, onDelete }) {
  const priorityCfg = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const categoryCfg = CATEGORY_CONFIG[todo.category] || CATEGORY_CONFIG.other;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface-card rounded-2xl p-4"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: todo.is_completed ? "#334155" : priorityCfg.color,
      }}
    >
      <View className="flex-row items-start gap-3">
        {/* Checkbox */}
        <TouchableOpacity onPress={onToggle} className="mt-0.5">
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              todo.is_completed ? "bg-emerald-500 border-emerald-500" : "border-slate-500"
            }`}
          >
            {todo.is_completed && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1">
          <Text
            className={`text-white font-semibold text-base mb-1 ${todo.is_completed ? "line-through opacity-50" : ""}`}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          {todo.description ? (
            <Text className="text-slate-400 text-sm mb-2" numberOfLines={1}>
              {todo.description}
            </Text>
          ) : null}

          {/* Tags row */}
          <View className="flex-row items-center gap-2 flex-wrap">
            {/* Category badge */}
            <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: categoryCfg.color + "22" }}>
              <Text className="text-xs">{categoryCfg.icon}</Text>
              <Text style={{ color: categoryCfg.color }} className="text-xs">{categoryCfg.label}</Text>
            </View>

            {/* Priority badge */}
            <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${priorityCfg.bg}`}>
              <Text className={`text-xs font-medium ${priorityCfg.text}`}>{priorityCfg.label}</Text>
            </View>

            {/* Date */}
            {todo.due_date && (
              <Text className="text-slate-500 text-xs">
                📅 {format(new Date(todo.due_date), "MMM dd")}
              </Text>
            )}
          </View>
        </View>

        {/* Delete */}
        <TouchableOpacity onPress={onDelete} className="p-1">
          <Ionicons name="trash-outline" size={18} color="#475569" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
