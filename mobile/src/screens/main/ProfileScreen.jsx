import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTodos } from "../../hooks/useTodos";
import { useAuthStore } from "../../store/authStore";
import { CATEGORY_CONFIG } from "../../constants";

const StatCard = ({ label, value, icon, color }) => (
  <View className="flex-1 bg-surface-card rounded-2xl p-4 items-center">
    <Text className="text-2xl mb-1">{icon}</Text>
    <Text className="text-white font-bold text-2xl" style={{ color }}>{value}</Text>
    <Text className="text-slate-400 text-xs mt-1 text-center">{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data } = useTodos({});
  const todos = data?.todos || [];
  const total = data?.total || 0;
  const completed = todos.filter((t) => t.is_completed).length;
  const pending = todos.filter((t) => !t.is_completed).length;
  const highPriority = todos.filter((t) => t.priority === "high").length;

  const byCat = Object.keys(CATEGORY_CONFIG).map((key) => ({
    key,
    ...CATEGORY_CONFIG[key],
    count: todos.filter((t) => t.category === key).length,
  }));

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="px-6 pt-6 pb-10">
        {/* User header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary-600 items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-white">
              {(user?.full_name || user?.username || "?")[0].toUpperCase()}
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold">{user?.full_name || user?.username}</Text>
          <Text className="text-slate-400 text-sm mt-1">@{user?.username}</Text>
          <Text className="text-slate-500 text-sm">{user?.email}</Text>
        </View>

        {/* Stats */}
        <Text className="text-white font-semibold text-lg mb-3">Statistics</Text>
        <View className="flex-row gap-3 mb-3">
          <StatCard label="Total" value={total} icon="📋" color="#3b82f6" />
          <StatCard label="Done" value={completed} icon="✅" color="#10b981" />
          <StatCard label="Pending" value={pending} icon="⏳" color="#f59e0b" />
        </View>
        <View className="flex-row gap-3 mb-8">
          <StatCard label="High Priority" value={highPriority} icon="🔥" color="#ef4444" />
          <StatCard
            label="Completion"
            value={total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%"}
            icon="📈"
            color="#8b5cf6"
          />
        </View>

        {/* Categories */}
        <Text className="text-white font-semibold text-lg mb-3">By Category</Text>
        <View className="bg-surface-card rounded-2xl mb-8 overflow-hidden">
          {byCat.map((cat, idx) => (
            <View
              key={cat.key}
              className={`flex-row items-center px-4 py-3 ${idx < byCat.length - 1 ? "border-b border-slate-700" : ""}`}
            >
              <Text className="text-xl mr-3">{cat.icon}</Text>
              <Text className="text-white flex-1">{cat.label}</Text>
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: cat.color + "33" }}
              >
                <Text style={{ color: cat.color }} className="text-xs font-bold">{cat.count}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-red-500/20 border border-red-500/40 rounded-2xl py-4 items-center flex-row justify-center gap-3"
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text className="text-red-400 font-semibold text-base">Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
