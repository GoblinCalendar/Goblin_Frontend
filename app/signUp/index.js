import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';  // 뒤로가기 버튼
import InputBox from '../../components/InputBox';      // 인풋 박스
import PasswordInputBox from '../../components/PasswordInputBox';      // 비밀번호 인풋 박스
import ButtonComponent from '../../components/Button';  // 가입 완료 버튼
import colors from '../../styles/colors';  // 색상 스타일
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function SignUp() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    password: '',
  });

  // 가입 완료 버튼 활성화 여부
  const isFormValid = name.length > 0 && userId.length > 0 && password.length > 0;

  const handleSubmit = () => {
    let newErrors = { name: '', userId: '', password: '' };
    let valid = true;

    // 이름 체크: 한글만 허용
    if (!/^[가-힣]+$/.test(name)) {
      newErrors.name = '한글로 입력해 주세요';
      valid = false;
    }

    // 아이디 체크: 8자 이상
    if (userId.length < 8) {
      newErrors.userId = '최소 8자 이상 입력해 주세요';
      valid = false;
    }

    // 비밀번호 체크: 10자 이상
    if (password.length < 10) {
      newErrors.password = '최소 10자 이상 입력해 주세요';
      valid = false;
    }

    // 오류가 있으면 상태 업데이트
    if (!valid) {
      setErrors(newErrors);
    } else {
      // 성공 메시지
    Toast.show({
        type: 'info',
        text1: '회원가입 성공!',
        text2: '환영합니다! 🎉',
        position: 'bottom',
        visibilityTime: 2000,
      });
  
      // 2초 후 이동
      setTimeout(() => {
        router.push('/signIn');
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backBtnContainer}>
        {/* 뒤로가기 버튼 */}
        <BackButton navigateTo='/landingPage'/>
      </View>

      {/* 상단 타이틀 */}
      <Text style={styles.title}>가입하기</Text>

      {/* 이름 입력 */}
      <Text style={styles.label}>이름</Text>
      <View style={styles.inputContainer}>
        <InputBox
            placeholder="이름을 입력해 주세요"
            onChangeText={(value) => {
                setName(value);
                setErrors({ ...errors, name: '' }); // 입력 중 오류 메시지 초기화
            }}
            style={styles.input}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      {/* 아이디 입력 */}
      <Text style={styles.label}>아이디</Text>
      <View style={styles.inputContainer}>
        <InputBox
            placeholder="아이디를 입력해 주세요 (최소 8자 이상)"
            onChangeText={(value) => {
                setUserId(value);
                setErrors({ ...errors, userId: '' }); // 입력 중 오류 메시지 초기화
            }}
            style={styles.input}
        />
        {errors.userId ? <Text style={styles.errorText}>{errors.userId}</Text> : null}
      </View>

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <PasswordInputBox
            placeholder="비밀번호를 입력해 주세요 (최소 10자 이상)"
            onChangeText={(value) => {
                setPassword(value);
                setErrors({ ...errors, password: '' }); // 입력 중 오류 메시지 초기화
            }}
            style={styles.input}
            secureTextEntry={true} // 비밀번호 입력 감춤
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      {/* 가입 완료 버튼 */}
      <ButtonComponent
        title="가입 완료"
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 70,
    color: colors.black,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 32,
    color: colors.black,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    marginTop: 20,
  },
  submitButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: 730,
  },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    marginTop: 5,
  },
});
