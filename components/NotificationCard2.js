import React, { useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity , Animated } from 'react-native';
import BellIcon from '../assets/bell.svg';
import colors from '../styles/colors';
import { useRouter } from 'expo-router';
import { NotificationContext } from '../context/NotificationContext';
import ArrowRight from '../assets/arrow_right.svg';

const NotificationCard2 = () => {
    const router = useRouter();
    const { showNotification, setShowNotification } = useContext(NotificationContext); // 전역 상태에서 알림 표시 여부를 가져옴
    const slideAnim = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
      if (showNotification) {
        // 알림이 표시될 때 애니메이션 시작
        Animated.timing(slideAnim, {
          toValue: 100, // 알림이 나타날 위치
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        // 알림이 사라질 때 애니메이션
        Animated.timing(slideAnim, {
          toValue: -150, // 알림이 사라질 위치
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, [showNotification, slideAnim]);

    if (!showNotification) return null; // 알림을 표시할 필요가 없으면 렌더링하지 않음

    // "일정 확정하기" 버튼을 눌렀을 때 호출될 함수
  const handleConfirmPress = () => {
    setShowNotification(false);
    router.push('/HostEventConfirm'); // HostEventConfirm 페이지로 이동
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
      {/* 상단 배경 박스와 알림 텍스트 */}
      <View style={styles.header}>
        <BellIcon width={24} height={24} marginLeft={12} />
        <Text style={styles.headerText}>일정을 확정해주세요!</Text>
      </View>

      {/* 하단 본문 내용 */}
      <View style={styles.body}>
        <Text style={styles.title}>성북뭉게구름톤</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.duration}>1시간 30분</Text>
          <Text style={styles.divider}>ㅣ</Text>
          <Text style={styles.date}>24.09.10 ~ 24.09.15</Text>
        </View>
        <TouchableOpacity style={styles.confirmButtonContainer} onPress={handleConfirmPress}>
          <ArrowRight style={styles.confirmButton}></ArrowRight>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 335,
    height: 112,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    position: 'absolute', // 화면에 고정
    zIndex: 50, // 최우선으로 처리
    alignSelf: 'center',
  },
  header: {
    backgroundColor: colors.buttonAfterColor, // 상단 배경색
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 335,
    height: 42,
    textAlign: 'center',
  },
  headerText: {
    color: colors.white, // 하얀색 텍스트
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  confirmButtonContainer: {
    backgroundColor: colors.skyBlue,
    height: 32,
    width: 32,
    borderRadius: 16,
    position: 'absolute',
    top: 12,
    left: 287,
    justifyContent: 'center'
  },
  confirmButton: {
    width: 16,
    height: 16,
    alignSelf: 'center',
  },
  body: {
    height: 60,
    width: 335,
    backgroundColor: colors.calendarColor,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 16,
    color: colors.font02Gray,
    fontWeight: '500',
    marginTop: 12,
    marginLeft: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 16,
    height: 18,
  },
  duration: {
    color: colors.fontGray,
    fontSize: 10,
  },
  divider: {
    color: colors.LineDisabled,
    marginHorizontal: 4,
    fontSize: 10,
  },
  date: {
    color: colors.fontGray,
    fontSize: 10,
  },
});

export default NotificationCard2;
