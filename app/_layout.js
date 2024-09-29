import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screenContent,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="createEventHostView/eventDate" />
        <Stack.Screen name="createEventHostView/eventName" />
        <Stack.Screen name="createEventHostView/eventPeople" />
        <Stack.Screen name="createEventHostView/eventTime" />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
});
