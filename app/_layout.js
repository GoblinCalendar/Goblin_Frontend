import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet, LogBox } from "react-native";
import { EventProvider } from "../context/EventContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "../context/NotificationContext";
import { AuthProvider } from "../context/AuthContext";
import NotificationCard from "../components/NotificationCard";
import Toast from "react-native-toast-message";
import { UserProvider } from "../context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

console.warn = () => {}; //warn 경고 안뜨게함
LogBox.ignoreAllLogs(); // 앱 실행될 때 앱에뜨는 모든 로그 무시

const toastConfig = {
  successToast: ({ text1 }) => (
    <View
      style={{
        height: 38,
        width: 162,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 100,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{text1}</Text>
    </View>
  ),
  errorToast: ({ text1 }) => (
    <View
      style={{
        height: 38,
        width: 162,
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 100,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{text1}</Text>
    </View>
  ),
};

//react query
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <UserProvider>
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
                    <Stack.Screen name="landingPage" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="createEventHostView/eventDate" />
                    <Stack.Screen name="createEventHostView/eventName" />
                    <Stack.Screen name="createEventHostView/eventPeople" />
                    <Stack.Screen name="createEventHostView/eventTime" />
                    <Stack.Screen name="createEventHostView/eventPlace" />
                    <Stack.Screen name="createEventHostView/eventComplete" />
                    <Stack.Screen name="joinEventGuestView" />
                    <Stack.Screen name="memberHostView" />
                    <Stack.Screen name="signUp" />
                  </Stack>
                </NotificationProvider>
              </EventProvider>
            </UserProvider>
          </AuthProvider>
        </SafeAreaProvider>
        {/* Toast 설정 */}
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
