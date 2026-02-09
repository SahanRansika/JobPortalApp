import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function TabsLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Real-time role check එකක් දාමු, එතකොට Admin කෙනෙක් role එක change කරපු ගමන් Tabs ටිකත් update වෙනවා
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setRole(doc.data().role);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // අවසර පරීක්ෂා කිරීම්
  const isAdmin = role === 'admin';
  const canPostJob = role === 'admin' || role === 'recruiter';

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#007AFF",
      headerShown: false,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 90 : 75, 
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        paddingTop: 10,
        position: 'absolute',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#ffffff',
        elevation: 20,
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

      {/* හැමෝටම පෙනෙන Community Feedback පිටුව */}
      <Tabs.Screen
        name="feedbacks"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="show-job"
        options={{ href: null }} // Tab bar එකේ පෙන්වන්නේ නැත
      />

      {/* Admin සහ Recruiter දෙදෙනාටම පෙනෙන 'Post Job' පිටුව */}
      <Tabs.Screen
        name="create-job"
        options={{
          title: "Post Job",
          href: canPostJob ? "/create-job" : null,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={28} color={color} />,
        }}
      />

      {/* Admin ට පමණක් පෙනෙන 'Manage Roles' (Add Recruiter) පිටුව */}
      <Tabs.Screen
        name="add-recruiter"
        options={{
          title: "Admin",
          href: isAdmin ? "/add-recruiter" : null,
          tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark-outline" size={24} color={color} />,
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