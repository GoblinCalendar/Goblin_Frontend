import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventProvider } from '../context/EventContext';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationCard from '../components/NotificationCard';
import Toast from 'react-native-toast-message';

console.warn = () => {}; //warn 경고 안뜨게함

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaProvider>
        <EventProvider>
          <NotificationProvider>
            {/* 모든 화면에서 NotificationCard를 렌더링 */}
            <NotificationCard />
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
            <Stack.Screen name="joinEventGuestView" />
            <Stack.Screen name="signUp" />
            </Stack>
          </NotificationProvider>
        </EventProvider>
      </SafeAreaProvider>
      {/* Toast 설정 */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});
