import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // AntDesign import කරන්න
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#007AFF",
      headerShown: false,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 90 : 95, 
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 10,
        position: 'absolute',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#ffffff',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      
      {/* Show Job සඳහා AntDesign Icon එක ඇතුළත් කිරීම */}
      <Tabs.Screen
        name="show-job"
        options={{
          title: "View Jobs",
          tabBarIcon: ({ color }) => <AntDesign name="appstore-add" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create-job"
        options={{
          title: "Create Post",
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={30} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}