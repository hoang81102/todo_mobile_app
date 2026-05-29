import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/main/HomeScreen";
import CreateTodoScreen from "../screens/main/CreateTodoScreen";
import TodoDetailScreen from "../screens/main/TodoDetailScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
      <Stack.Screen name="CreateTodo" component={CreateTodoScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1e293b",
          borderTopColor: "#334155",
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#475569",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Tasks: focused ? "checkmark-circle" : "checkmark-circle-outline",
            Profile: focused ? "person" : "person-outline",
          };
          return <Ionicons name={icons[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tasks" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
