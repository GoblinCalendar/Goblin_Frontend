import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventProvider } from '../context/EventContext';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EventProvider>
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
          <Stack.Screen name="createEventHostView/eventPlace" />
          <Stack.Screen name="createEventHostView/eventComplete" />
        </Stack>
      </EventProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
