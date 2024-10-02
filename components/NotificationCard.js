import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity  } from 'react-native';
import BellIcon from '../assets/bell.svg';
import colors from '../styles/colors';
import { useRouter } from 'expo-router';
import { NotificationContext } from '../context/NotificationContext';

const NotificationCard = () => {
    const router = useRouter();
    const { showNotification } = useContext(NotificationContext); // 전역 상태에서 알림 표시 여부를 가져옴

    if (!showNotification) return null; // 알림을 표시할 필요가 없으면 렌더링하지 않음

    // "일정 확정하기" 버튼을 눌렀을 때 호출될 함수
  const handleConfirmPress = () => {
    router.push('/HostEventConfirm'); // HostEventConfirm 페이지로 이동
  };

  return (
    <View style={styles.cardContainer}>
      {/* 상단 배경 박스와 알림 텍스트 */}
      <View style={styles.header}>
        <BellIcon width={24} height={24} marginLeft={12} />
        <Text style={styles.headerText}>일정을 확정해주세요!</Text>
        <TouchableOpacity onPress={handleConfirmPress}>
          <Text style={styles.confirmText}>일정 확정하기 {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 본문 내용 */}
      <View style={styles.body}>
        <Text style={styles.title}>성북뭉게구름톤</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.duration}>1시간 30분</Text>
          <Text style={styles.divider}> | </Text>
          <Text style={styles.date}>24.09.10 ~ 24.09.15</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 335,
    height: 118,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    position: 'absolute', // 화면에 고정
    top: 100, // 상단에서 100px 아래
    left: '50%',
    transform: [{ translateX: -335 / 2 }],
    zIndex: 50, // 최우선으로 처리
  },
  header: {
    backgroundColor: colors.buttonAfterColor, // 상단 배경색
    flexDirection: 'row',
    alignItems: 'center',
    width: 335,
    height: 42,
  },
  headerText: {
    color: colors.white, // 하얀색 텍스트
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 12,
    height: 18,
  },
  confirmText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 12,
    height: 18,
    marginLeft: 110,
  },
  body: {
    height: 76,
    width: 335,
    backgroundColor: colors.calendarColor,
  },
  title: {
    fontSize: 20,
    color: colors.fontGray,
    height: 28,
    fontWeight: '500',
    marginTop: 10,
    marginLeft: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 12,
    height: 18,
  },
  duration: {
    color: colors.fontGray,
    fontSize: 12,
  },
  divider: {
    color: colors.LineDisabled,
    marginHorizontal: 4,
  },
  date: {
    color: colors.fontGray,
    fontSize: 12,
  },
});

export default NotificationCard;
