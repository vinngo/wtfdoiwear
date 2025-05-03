import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index"></Stack.Screen>
      <Stack.Screen name="closet"></Stack.Screen>
      <Stack.Screen name="swipe"></Stack.Screen>
    </Stack>
  );
}
