import React , { useContext } from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { NotificationContext } from "../context/NotificationContext";

export default function Index() {
  const router = useRouter();

  const { triggerNotification } = useContext(NotificationContext);  // 알림을 제어할 함수

  // 버튼 클릭 시 알림을 띄우는 함수
  const handleGuestSelectionComplete = () => {
    triggerNotification();  // 알림을 표시
  };

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
      <Button 
        title="게스트 선택 완료" 
        onPress={handleGuestSelectionComplete} 
      />
      <Button 
        title="멤버 목록 보기" 
        onPress={() => router.push("/memberHostView")} 
      />
      <Button 
        title="랜딩 페이지 보기" 
        onPress={() => router.push("/landingPage")} 
      />
      <Button 
        title="그룹 만들기 테스트로 가기" 
        onPress={() => router.push("/testGroups")} 
      />
    </View>
  );
}
