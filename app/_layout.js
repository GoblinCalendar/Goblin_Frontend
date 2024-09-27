import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: styles.screenContent
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="createEventHostView/eventDate" />
      <Stack.Screen name="createEventHostView/eventName" />
      <Stack.Screen name="createEventHostView/eventPeople" />
      <Stack.Screen name="createEventHostView/eventTime" />
      <Stack.Screen name="createEventHostView/eventPlace" />
      <Stack.Screen name="createEventHostView/eventComplete" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16, // 추가적인 여백 조절
  },
});
