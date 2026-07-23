import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";

const getErrorMessage = (err) => {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || JSON.stringify(d)).join("\n");
  }
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return err.message || "Something went wrong";
};

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      Alert.alert("Login Failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-20 pb-10">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-3xl bg-primary-600 items-center justify-center mb-4">
              <Text className="text-4xl">✅</Text>
            </View>
            <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
            <Text className="text-slate-400 text-base">Sign in to your account</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-slate-400 text-sm font-medium mb-2">Email</Text>
              <TextInput
                className="bg-surface-card border border-slate-700 rounded-xl px-4 py-4 text-white text-base"
                placeholder="Enter your email"
                placeholderTextColor="#475569"
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-slate-400 text-sm font-medium mb-2">Password</Text>
              <TextInput
                className="bg-surface-card border border-slate-700 rounded-xl px-4 py-4 text-white text-base"
                placeholder="Enter your password"
                placeholderTextColor="#475569"
                value={form.password}
                onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-primary-600 rounded-xl py-4 items-center mt-2"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-primary-400 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
