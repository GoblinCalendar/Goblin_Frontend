import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "../../components/BackButton"; // 뒤로가기 버튼
import InputBox from "../../components/InputBox"; // 인풋 박스
import PasswordInputBox from "../../components/PasswordInputBox"; // 비밀번호 인풋 박스
import ButtonComponent from "../../components/Button"; // 로그인 버튼
import LogoSvg from "../../assets/logo_blue.svg"; // 로고 SVG
import colors from "../../styles/colors"; // 색상 스타일
import { useRouter } from "expo-router";
import apiClient from "../../lib/api"; // API 요청을 위한 axios 인스턴스
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/UserContext";

export default function SignIn() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // 로그인 오류 메시지 상태
  const router = useRouter();
  const [errors, setErrors] = useState({
    userId: "",
    password: "",
  });

  // UserContext
  const {
    setUserId: setUserIdContext,
    setUsername: setUsernameContext,
    setUserRole: setUserRoleContext,
    setGroupId: setGroupIdContext,
    setGroupName: setGroupNameContext,
  } = useContext(UserContext);

  // 앱이 시작될 때 저장된 아이디와 비밀번호 가져오기
  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("storedUserId");
        const storedPassword = await AsyncStorage.getItem("storedPassword");

        if (storedUserId && storedPassword) {
          setUserId(storedUserId);
          setPassword(storedPassword);
          handleSubmit(storedUserId, storedPassword); // 저장된 정보로 자동 로그인
        }
      } catch (error) {
        console.error("저장된 자격 증명을 가져오는 중 오류 발생:", error);
      }
    };

    loadStoredCredentials();
  }, []);

  // 로그인 버튼 활성화 여부
  const isFormValid = userId.length > 0 && password.length > 0;

  const handleSubmit = async () => {
    let newErrors = { userId: "", password: "" };
    let valid = true;

    if (userId.length === 0) {
      newErrors.userId = "아이디를 입력해 주세요";
      valid = false;
    }

    if (password.length === 0) {
      newErrors.password = "비밀번호를 입력해 주세요";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      // 로그인 API 호출
      const response = await apiClient.post("/api/users/login", {
        loginId: userId,
        password: password,
      });

      const { accessToken, refreshToken, loginId, username, personalGroupId } = response.data;

      // 콘솔에 로그인 성공 메시지와 토큰 정보 출력
      console.log("로그인 성공:", response.data);

      // Batch AsyncStorage operations
      const keyValuePairs = [
        ["accessToken", accessToken],
        ["refreshToken", refreshToken],
        ["userId", loginId],
        ["username", username],
        ["userRole", "USER"],
        ["groupId", String(personalGroupId)], // 문자열로 저장 or 앱 충돌
        ["personalGroupId", String(personalGroupId)], //개인 캘린더로 시작
        ["storedUserId", loginId], //아이디 저장
        ["storedPassword", password], //비번 저장
        ["isLoggedIn", "true"], // 로그인 상태를 AsyncStorage에 저장
      ];

      await AsyncStorage.multiSet(keyValuePairs);

      // 컨텍스트 저장
      setUserIdContext(userId);
      setUsernameContext(username);
      setUserRoleContext("USER");

      //개인 캘린더로 시작
      setGroupIdContext(personalGroupId);
      setGroupNameContext(`${username}님의 캘린더`);

      // 홈 화면으로 이동
      router.push("/monthly");
    } catch (error) {
      console.error(error);
      setLoginError("로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      {/* <View style={styles.backBtnContainer}>
        <BackButton navigateTo='/landingPage'/>
      </View> */}

      <LogoSvg width={200} height={60} style={styles.logo} />

      {/* 상단 타이틀 */}
      <Text style={styles.title}>모두의 일정, 한눈에 뚝딱 정리!</Text>

      {/* 아이디 입력 */}
      <Text style={styles.label}>아이디</Text>
      <View style={styles.inputContainer}>
        <InputBox
          placeholder="아이디를 입력해 주세요"
          onChangeText={(value) => {
            setUserId(value);
            setErrors({ ...errors, userId: "" }); // 입력 중 오류 메시지 초기화
          }}
          style={styles.input}
          maxLength={50}
        />
      </View>

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <PasswordInputBox
          placeholder="비밀번호를 입력해 주세요"
          onChangeText={(value) => {
            setPassword(value);
            setErrors({ ...errors, password: "" }); // 입력 중 오류 메시지 초기화
          }}
          style={styles.input}
          secureTextEntry={true} // 비밀번호 입력 감춤
        />
      </View>

      {/* 로그인 오류 메시지 */}
      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      {/* 로그인 버튼 */}
      <ButtonComponent
        title="로그인"
        isActive={isFormValid}
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
  },
  backBtnContainer: {
    position: "relative",
    top: 0,
    left: -25,
  },
  logo: {
    alignSelf: "center",
    marginTop: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 16,
    color: colors.fontGray,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 56,
    color: colors.black,
    marginLeft: 25,
  },
  inputContainer: {
    marginBottom: -10,
  },
  input: {
    marginTop: 20,
    marginLeft: 25,
  },
  submitButton: {
    position: "absolute",
    alignSelf: "center",
    top: 730,
  },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    position: "absolute",
    alignSelf: "center",
    top: 690,
  },
});
