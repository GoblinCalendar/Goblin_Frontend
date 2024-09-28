import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventProvider } from '../context/EventContext';

export default function RootLayout() {
  return (
    <EventProvider>
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
    </EventProvider>
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
