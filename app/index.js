import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text>Main 화면-</Text>
      <Button title="메인 달력" onPress={() => router.push("/monthly")} />
      <Button
        title="이벤트 생성 화면으로 이동"
        onPress={() => router.push("/createEventHostView/eventName")}
      />
      <Button
        title="이벤트 시간 고르는 화면으로 이동"
        onPress={() => router.push("/joinEventGuestView")}
      />
    </View>
  );
}
