import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../../styles/colors';
import CheckCircle from '../../../assets/circle_check.svg';
import { useSearchParams, useRouter } from 'expo-router';
import ButtonComponent from '../../../components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const JoinEventComplete = () => {
    const router = useRouter();
    // const { headerText } = useSearchParams();  // 전달된 headerText 받기

  // "홈으로 가기" 버튼을 눌렀을 때 호출될 함수
  const handleGoHome = () => {
    router.push('/monthly'); // 홈 화면으로 이동
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle width={58} height={58} marginTop={164} />
        <Text style={styles.title}>2차 대면 회의</Text> {/*이것도 불러오기*/}
        <Text style={styles.subtitle}>일정 등록 완료</Text> {/*이것도 불러오기*/}
        <Text style={styles.description}>일정이 확정되면, 다시 알려드릴게요!</Text> {/*이것도 불러오기*/}
      </View>
      {/* ButtonComponent 사용 */}
      <ButtonComponent 
            title="홈으로 가기" 
            style={styles.button} 
            isActive={true} 
            onPress={handleGoHome} 
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    color: colors.black,
    fontSize: 24,
    height: 34,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 24,
    color: colors.black,
    height: 34,
  },
  description: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    height: 20,
    color: colors.font04Gray,
  },
  button: {
    marginTop: 360,
    alignItems: 'center',
  },
});

export default JoinEventComplete;
