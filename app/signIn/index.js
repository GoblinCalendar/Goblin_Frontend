import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';  // 뒤로가기 버튼
import InputBox from '../../components/InputBox';      // 인풋 박스
import PasswordInputBox from '../../components/PasswordInputBox';      // 비밀번호 인풋 박스
import ButtonComponent from '../../components/Button';  // 로그인 버튼
import LogoSvg from '../../assets/logo_blue.svg'; // 로고 SVG
import colors from '../../styles/colors';  // 색상 스타일
import { useRouter } from 'expo-router';

export default function SignIn() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // 로그인 오류 메시지 상태
  const router = useRouter();
  const [errors, setErrors] = useState({
    userId: '',
    password: '',
  });

  // 임시 데이터
  const VALID_USER_ID = 'useradmin';
  const VALID_PASSWORD = 'useradmin12';

  // 가입 완료 버튼 활성화 여부
  const isFormValid = userId.length > 0 && password.length > 0;

  const handleSubmit = () => {
    let newErrors = { userId: '', password: '' };
    let valid = true;

    // 입력된 값과 임시 데이터 비교
    if (userId !== VALID_USER_ID || password !== VALID_PASSWORD) {
      setLoginError('올바르지 않은 아이디와 비밀번호입니다.');
      valid = false;
    } else {
      setLoginError('');
      valid = true;
    }

    // 오류가 있으면 상태 업데이트
    if (!valid) {
      setErrors(newErrors);
    } else {
      // 조건을 만족하면 홈 화면으로 이동
      router.push('/');
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
                setErrors({ ...errors, userId: '' }); // 입력 중 오류 메시지 초기화
            }}
            style={styles.input}
        />
      </View>

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <PasswordInputBox
            placeholder="비밀번호를 입력해 주세요"
            onChangeText={(value) => {
                setPassword(value);
                setErrors({ ...errors, password: '' }); // 입력 중 오류 메시지 초기화
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
    position: 'relative',
  },
  backBtnContainer: {
    position: 'relative',
    top: 0,
    left: -25,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    color: colors.fontGray,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 56,
    color: colors.black,
    marginLeft:25,
  },
  inputContainer: {
    marginBottom: -10,
  },
  input: {
    marginTop: 20,
    marginLeft: 25,
  },
  submitButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: 730,
  },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    position: 'absolute',
    alignSelf: 'center',
    top: 690,
  },
});
