import { AuthProvider } from "../context/AuthContext";
import { LoaderProvider } from "../context/LoaderContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LoaderProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth Group */}
          <Stack.Screen name="(auth)" />
          {/* Main App Tabs Group */}
          <Stack.Screen name="(tabs)" />
          {/* Modals or other screens */}
          <Stack.Screen name="job-details/[id]" options={{ presentation: 'modal', headerShown: true, title: "Job Details" }} />
        </Stack>
      </AuthProvider>
    </LoaderProvider>
  );
}