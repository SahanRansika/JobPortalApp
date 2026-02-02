import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, View, Text } from "react-native";

// Tabs configuration array
// Icons names check kala MaterialIcons walata anuwa
const tabs = [
    { name: "home", icon: "home", title: "Home" },
    { name: "login", icon: "assignment", title: "login" },
    { name: "sginup", icon: "assignment", title: "sginup" },
    { name: "profile", icon: "bubble-chart", title: "profile" },
    { name: "createjob", icon: "person", title: "createjob" }
] as const;

const DashboardLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#007AFF", // Active unama blue color eka
                tabBarInactiveTintColor: "#94A3B8", // Inactive unama gray color eka
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E2E8F0",
                    height: Platform.OS === 'ios' ? 90 : 70, // Mobile wala height eka
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                    // Laptop/Web ekedi meka thavath lassanata penna shadows
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                }
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name} // Map karaddi 'key' eka aniwaaryai
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name={tab.icon as any} color={color} size={size + 4} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
};

export default DashboardLayout;