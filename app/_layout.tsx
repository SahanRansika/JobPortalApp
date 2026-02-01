import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="create-job" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
