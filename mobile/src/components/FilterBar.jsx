import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from "../constants";

const Chip = ({ label, active, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-1.5 rounded-xl mr-2 ${active ? "" : "bg-surface-card border border-slate-700"}`}
    style={active ? { backgroundColor: color + "33", borderWidth: 1, borderColor: color } : {}}
  >
    <Text style={{ color: active ? color : "#64748b" }} className="text-xs font-medium">
      {label}
    </Text>
  </TouchableOpacity>
);

export default function FilterBar({ filters, onChange }) {
  const toggleFilter = (key, value) => {
    onChange((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const hasFilter = filters.isCompleted !== undefined || filters.priority || filters.category;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
      <View className="flex-row items-center pb-2">
        {/* Status */}
        <Chip
          label="✅ Done"
          active={filters.isCompleted === true}
          color="#10b981"
          onPress={() => toggleFilter("isCompleted", true)}
        />
        <Chip
          label="⏳ Pending"
          active={filters.isCompleted === false}
          color="#f59e0b"
          onPress={() => toggleFilter("isCompleted", false)}
        />

        {/* Priorities */}
        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
          <Chip
            key={key}
            label={`${cfg.icon} ${cfg.label}`}
            active={filters.priority === key}
            color={cfg.color}
            onPress={() => toggleFilter("priority", key)}
          />
        ))}

        {/* Categories */}
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <Chip
            key={key}
            label={`${cfg.icon} ${cfg.label}`}
            active={filters.category === key}
            color={cfg.color}
            onPress={() => toggleFilter("category", key)}
          />
        ))}

        {/* Clear */}
        {hasFilter && (
          <TouchableOpacity
            onPress={() => onChange({ isCompleted: undefined, priority: undefined, category: undefined })}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 mr-2"
          >
            <Text className="text-red-400 text-xs font-medium">✕ Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
