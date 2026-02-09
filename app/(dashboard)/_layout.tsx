import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native"; // OS එක අනුව වෙනස් කිරීමට

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#007AFF",
      headerShown: false,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 95 : 95, // උස මඳක් වැඩි කරන ලදි
        paddingBottom: Platform.OS === 'ios' ? 30 : 15, // පහළින් ඉඩ තැබීම
        paddingTop: 10,
        position: 'absolute', // මෙනු එක පාවෙන ස්වභාවයක් ලබා දීමට
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ffffff',
        elevation: 10, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-job"
        options={{
          title: "Create Job",
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

// <AntDesign name="appstore-add" size={24} color="black" />