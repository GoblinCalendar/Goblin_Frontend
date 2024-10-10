// import React , { useContext } from "react";
// import { View, Text, Button } from "react-native";
// import { useRouter } from "expo-router";
// import { NotificationContext } from "../context/NotificationContext";

// export default function Index() {
//   const router = useRouter();

//   const { triggerNotification } = useContext(NotificationContext);  // 알림을 제어할 함수

//   // 버튼 클릭 시 알림을 띄우는 함수
//   const handleGuestSelectionComplete = () => {
//     triggerNotification();  // 알림을 표시
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
//       <Text>Main 화면-</Text>

//       <Button title="메인 달력" onPress={() => router.push("/monthly")} />
//       <Button
//         title="이벤트 생성 화면으로 이동"
//         onPress={() => router.push("/createEventHostView/eventName")}
//       />
//       <Button
//         title="이벤트 시간 고르는 화면으로 이동"
//         onPress={() => router.push("/joinEventGuestView")}
//       />
//       <Button 
//         title="게스트 선택 완료" 
//         onPress={handleGuestSelectionComplete} 
//       />
//       <Button 
//         title="멤버 목록 보기" 
//         onPress={() => router.push("/memberHostView")} 
//       />
//       <Button 
//         title="랜딩 페이지 보기" 
//         onPress={() => router.push("/landingPage")} 
//       />
//       <Button 
//         title="알람 테스트 가기" 
//         onPress={() => router.push("/notiTest")} 
//       />
//     </View>
//   );
// }


import React, { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext"; // AuthContext를 가져옴
import LandingPage from "./landingPage"; // 랜딩 페이지 컴포넌트 가져옴

export default function Index() {
  const { isLoggedIn } = useContext(AuthContext); // 로그인 상태를 확인
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === null) {
      // 로그인 상태를 로드 중인 경우
      return;
    } else if (isLoggedIn) {
      // 로그인되어 있으면 메인 페이지로 이동
      router.replace("/monthly");
      // router.replace("/landingPage");
    } else {
      // 로그인되어 있지 않으면 랜딩 페이지로 이동
      router.replace("/landingPage");
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    // 로그인 상태를 확인 중일 때 로딩 스피너 표시
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
