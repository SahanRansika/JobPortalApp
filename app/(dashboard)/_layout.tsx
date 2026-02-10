import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function TabsLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // පරිශීලකයාගේ Role එක (admin/recruiter/user) Real-time පරීක්ෂා කිරීම
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // අවසර පරීක්ෂා කිරීම් (Permission Checks)
  const isAdmin = role === 'admin';
  const canPostJob = role === 'admin' || role === 'recruiter';

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "#64748B",
      headerShown: false,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 90 : 70, 
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 10,
        position: 'absolute',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#ffffff',
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }
    }}>
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. Inboxes (Menu එකෙන් සඟවා ඇත, නමුත් Navigate කළ හැක) */}
      <Tabs.Screen
        name="view-applications"
        options={{
          href: null, // bottom bar එකෙන් අයින් කිරීමට
        }}
      />

      {/* 3. Community / Feedbacks Tab */}
      <Tabs.Screen
        name="feedbacks"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={24} color={color} />,
        }}
      />
      
      {/* 4. Show Job Details (Menu එකෙන් සඟවා ඇත) */}
      <Tabs.Screen
        name="show-job"
        options={{ 
          href: null 
        }} 
      />

      {/* 5. Create Job (Admin සහ Recruiter ට පමණක් පෙනේ) */}
      <Tabs.Screen
        name="create-job"
        options={{
          title: "Post Job",
          href: canPostJob ? "/create-job" : null,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={28} color={color} />,
        }}
      />

      {/* 6. Admin Panel (Admin ට පමණක් පෙනේ) */}
      <Tabs.Screen
        name="add-recruiter"
        options={{
          title: "Admin",
          href: isAdmin ? "/add-recruiter" : null,
          tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark-outline" size={24} color={color} />,
        }}
      />

      {/* 7. Profile Tab */}
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