import React, { useContext, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity , Animated } from 'react-native';
import BellIcon from '../assets/bell.svg';
import colors from '../styles/colors';
import { useRouter } from 'expo-router';
import { NotificationContext } from '../context/NotificationContext';
import ArrowRight from '../assets/arrow_right.svg';
import { EventSourcePolyfill } from 'event-source-polyfill';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarSVG from '../assets/calendar_gray.svg';
import ClockSVG from '../assets/clock_gray.svg';
import CheckButtonSVG from '../assets/check_button.svg';

// 전역 EventSource를 EventSourcePolyfill로 설정
global.EventSource = EventSourcePolyfill;

const NotificationCard = () => {
    const router = useRouter();
    const { showNotification, setShowNotification } = useContext(NotificationContext); // 전역 상태에서 알림 표시 여부를 가져옴
    const slideAnim = useRef(new Animated.Value(-150)).current;
    const [currentNotification, setCurrentNotification] = useState(null); // 현재 알림 데이터 저장

    useEffect(() => {
      const fetchTokenAndConnectSSE = async () => {
        try {
          // AsyncStorage에서 토큰을 가져옴
          const token = await AsyncStorage.getItem("accessToken");
          
          if (!token) {
            console.error('토큰을 찾을 수 없습니다.');
            return;
          }

          // SSE 연결 설정
          const url = 'https://gooblin.shop/api/groups/notifications'; // 알림을 받을 백엔드 URL
          const eventSource = new EventSource(url, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Connection': 'keep-alive',
              'Cache-Control': 'no-cache',
              'X-Accel-Buffering': 'no',
              'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
            },
            heartbeatTimeout: 120000,
            withCredentials: true,
          });
      
          eventSource.onopen = () => {
            console.log('SSE 연결이 성공적으로 열렸습니다.');
          };
      
          eventSource.addEventListener('notification', (event) => {
            const notification = JSON.parse(event.data);
            setCurrentNotification(notification); // 최신 알림 저장
            console.log("알림 데이터값: ", notification);
            setShowNotification(true); // 알림 표시
          });
      
          eventSource.onerror = (event) => {
            console.error('SSE 에러 발생:', event);
            eventSource.close(); // 연결 해제
          };
      
          // 컴포넌트 언마운트 시 연결 해제
          return () => {
            eventSource.close();
          };

        } catch (error) {
          console.error("토큰을 가져오는 중 오류 발생:", error);
        }
      };

      fetchTokenAndConnectSSE();
    }, []);

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

  // 알림의 타입에 따른 행동 처리
  const handleConfirmPress = () => {
    const { type, groupId, calendarId } = currentNotification;

    if (type === 'EVENT_CREATED') {
      // groupId와 calendarId를 쿼리 매개변수로 전달
      setShowNotification(false);
      router.push(`/joinEventGuestView?groupId=${groupId}&calendarId=${calendarId}`);
    } else if (type === 'MUST_FIX_EVENT') {
      // groupId와 calendarId를 쿼리 매개변수로 전달
      setShowNotification(false);
      router.push({
        pathname: '/HostEventConfirm',
        params: { groupId, calendarId }
      });
    } else if (type === 'EVENT_FIXED') {
      setShowNotification(false);  // 알림을 닫음
    }
  };

  // 알림의 타입에 따른 UI 렌더링
  const renderNotificationContent = () => {
    const { type, eventName, details1, details2 } = currentNotification;

    switch (type) {
      case 'EVENT_CREATED':
        return (
          <View style={styles.body}>
            <Text style={styles.title}>{eventName}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.duration}>{details1}</Text>
              <Text style={styles.divider}>ㅣ</Text>
              <Text style={styles.date}>{details2}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButtonContainer} onPress={handleConfirmPress}>
              <ArrowRight style={styles.confirmButton} />
            </TouchableOpacity>
          </View>
        );

      case 'MUST_FIX_EVENT':
        return (
          <View style={styles.body}>
            <Text style={styles.title}>{eventName}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.duration}>{details1}</Text>
              <Text style={styles.divider}>ㅣ</Text>
              <Text style={styles.date}>{details2}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButtonContainer} onPress={handleConfirmPress}>
              <ArrowRight style={styles.confirmButton} />
            </TouchableOpacity>
          </View>
        );

      case 'EVENT_FIXED':
        return (
          <View style={styles.body}>
            <Text style={styles.title}>{eventName}</Text>
            <View style={styles.detailsRow}>
              <CalendarSVG width={12} height={12} />
              <Text style={styles.date}>{details1}</Text>
              <Text style={styles.divider}>ㅣ</Text>
              <ClockSVG width={12} height={12} />
              <Text style={styles.time}>{details2}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButtonContainer} onPress={handleConfirmPress}>
              <CheckButtonSVG style={styles.confirmButton} />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.header}>
        <BellIcon width={24} height={24} marginLeft={12} />
        <Text style={styles.headerText}>
          {currentNotification.type === 'MUST_FIX_EVENT'
            ? '일정을 확정해주세요!'
            : currentNotification.type === 'EVENT_FIXED'
            ? '모임 일정이 확정됐어요!'
            : '새로운 모임 일정이 왔어요!'}
        </Text>
      </View>
      {renderNotificationContent()}
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

export default NotificationCard;
