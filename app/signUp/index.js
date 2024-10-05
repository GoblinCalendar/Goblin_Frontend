import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';  // 뒤로가기 버튼
import InputBox from '../../components/InputBox';      // 인풋 박스
import PasswordInputBox from '../../components/PasswordInputBox';      // 비밀번호 인풋 박스
import ButtonComponent from '../../components/Button';  // 가입 완료 버튼
import colors from '../../styles/colors';  // 색상 스타일
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import apiClient from '../../lib/api';

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

  const signupAPICall = async () => {
    try {
      // 서버로 요청 보내기 전 로그 찍기
      console.log('회원가입 요청 보냄:', {
        username: name,
        loginId: userId,
        password: password,
      });

      // 회원가입 API 호출 - apiClient 사용
      const response = await apiClient.post('/api/users/register', {
        username: name,
        loginId: userId,
        password: password,
      });

      // 응답 데이터 로그
      console.log('회원가입 응답:', response.data);

      // 성공 메시지 표시
      Toast.show({
        type: 'successToast',
        text1: '회원가입 성공!',
        position: 'bottom',
      });

      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/signIn');
      }, 2000);
    } catch (error) {
      // 에러 처리: 자세한 에러 로그 추가
      if (error.response) {
        // 서버가 응답을 했지만, 에러 상태 코드가 반환된 경우
        console.error('서버 응답 에러:', error.response.data);
        console.error('상태 코드:', error.response.status);
        console.error('헤더:', error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었으나, 서버로부터 응답이 없을 경우
        console.error('요청 전송 후 응답 없음:', error.request);
      } else {
        // 요청 설정 중에 에러가 발생한 경우
        console.error('요청 설정 에러:', error.message);
      }
      
      // 공통 에러 메시지 출력
      console.error('에러 설정:', error.config);

      Toast.show({
        type: 'errorToast',
        text1: '회원가입 실패!',
        position: 'bottom',
      });
    }
  }

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
      signupAPICall();
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
            maxLength={50}
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
            maxLength={20}
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 20,
    color: colors.black,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 32,
    color: colors.black,
    marginLeft: 25,
  },
  inputContainer: {
    marginBottom: 24,
    marginLeft: 25,
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
    marginTop: 14,
  },
});
