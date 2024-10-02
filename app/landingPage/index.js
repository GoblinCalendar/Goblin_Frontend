import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LogoSvg from '../../assets/logo_blue.svg'; // 로고 SVG
import IconSvg from '../../assets/icon.svg'; // 다른 아이콘 SVG (상단 아이콘으로 추정)
import ButtonComponent from '../../components/Button'; // 버튼 컴포넌트
import colors from '../../styles/colors'; // 색상 스타일
import { useRouter } from 'expo-router';

export default function LandingPage() {
    const router = useRouter();

    const signUpPress = () => {
        router.push('/signUp'); 
    };

    const signIpPress = () => {
        router.push('/signIn'); 
    };

  return (
    <View style={styles.container}>
      {/* 상단 아이콘 SVG */}
      <IconSvg width={160} height={160} style={styles.icon} />

      {/* 가운데 로고 SVG */}
      <LogoSvg width={200} height={60} style={styles.logo} />

      {/* 텍스트 */}
      <Text style={styles.description}>
        모두의 일정,{"\n"}
        한눈에 뚝딱 정리!
      </Text>

      {/* 회원가입 버튼 */}
      <ButtonComponent 
        title="회원가입하러 가기" 
        isActive={true} 
        onPress={signUpPress} 
        style={styles.button}
      />

      {/* 하단 로그인 텍스트 */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>계정이 있으신가요? </Text>
        <TouchableOpacity onPress={signIpPress}>
          <Text style={styles.loginLink}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  icon: {
    marginTop: 140,
  },
  logo: {
    marginTop: 24,
  },
  description: {
    fontSize: 18,
    color: colors.fontGray,
    marginTop: 40,
    height: 56,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 28,
  },
  button: {
    marginTop: 182,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: colors.fontGray,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.skyBlue,
  },
});
