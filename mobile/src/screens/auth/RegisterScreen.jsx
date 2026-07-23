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

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password });
    } catch (err) {
      Alert.alert("Registration Failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Full Name *", placeholder: "Enter your full name" },
    { key: "email", label: "Email *", placeholder: "Enter your email", keyboardType: "email-address", autoCapitalize: "none" },
    { key: "password", label: "Password *", placeholder: "Create a password", secure: true },
    { key: "confirmPassword", label: "Confirm Password *", placeholder: "Repeat your password", secure: true },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-16 pb-10">
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-accent-purple items-center justify-center mb-4">
              <Text className="text-4xl">🚀</Text>
            </View>
            <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
            <Text className="text-slate-400 text-base">Join us today, it's free!</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {fields.map((f) => (
              <View key={f.key}>
                <Text className="text-slate-400 text-sm font-medium mb-2">{f.label}</Text>
                <TextInput
                  className="bg-surface-card border border-slate-700 rounded-xl px-4 py-4 text-white text-base"
                  placeholder={f.placeholder}
                  placeholderTextColor="#475569"
                  value={form[f.key]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                  secureTextEntry={f.secure}
                  autoCapitalize={f.autoCapitalize || "words"}
                  keyboardType={f.keyboardType || "default"}
                />
              </View>
            ))}

            <TouchableOpacity
              className="bg-accent-purple rounded-xl py-4 items-center mt-2"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-primary-400 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
