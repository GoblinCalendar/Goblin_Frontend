import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import colors from '../../styles/colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleScreen = () => {
  const router = useRouter();
  const maxParticipantsToShow = 6;
  const [participants, setParticipants] = useState([]);
  const extraParticipants = participants.length - maxParticipantsToShow;
  const [formattedData, setFormattedData] = useState(null);
  const [headerText, setHeaderText] = useState('2차 대면 회의'); // 알람에서 넘어올 때 같이 보내기

  const groupId = 4;
  const calendarId = 1;
  
  // TimeSelectionGrid에 접근하기 위한 ref 생성
  const timeSelectionGridRef = useRef(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}/participants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipants(response.data.map(participant => participant.username));
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [groupId, calendarId]);

  // 일정 등록 완료 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      const response = await apiClient.post(`/api/groups/${groupId}/calendar/${calendarId}/available-time`, {
        availableTimeSlots: [formattedData],  // formattedData를 서버로 보냄
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 성공 시 다음 화면으로 이동
      Alert.alert('성공', response.data.message, [
        {
          text: '확인',
          onPress: () => router.push(`/joinEventGuestView/joinEventComplete?headerText=${encodeURIComponent(headerText)}`)
        }
      ]);

    } catch (error) {
      // 에러 발생 시 에러 메시지 표시
      if (error.response) {
        // 서버에서 반환한 에러가 있는 경우
        console.error('에러 응답:', error.response.data);
        Alert.alert('에러', `에러가 발생했습니다: ${error.response.data.message}`);
      } else {
        // 서버에 도달하지 못한 경우
        console.error('서버에 도달할 수 없습니다:', error.message);
        Alert.alert('에러', '서버에 도달할 수 없습니다. 네트워크 상태를 확인하세요.');
      }
    }
  };

  // 초기화 버튼을 눌렀을 때 호출되는 함수
  const handleReset = () => {
    if (timeSelectionGridRef.current) {
      console.log('ref is working');
      timeSelectionGridRef.current.resetSelection();  // 선택한 시간 초기화
    } else {
      console.log('ref is null');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerBox}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{headerText}</Text>
              <View style={styles.headerDetails}>
                <Text style={styles.meetingDuration}>1시간 30분</Text> {/*이것도 불러오기*/}
                <Text style={styles.devide}> | </Text>
                <Text style={styles.meetingDate}>24.09.10 ~ 24.09.15</Text> {/*이것도 불러오기*/}
              </View>
              <View style={styles.participantContainer}>
                {participants.slice(0, maxParticipantsToShow).map((participant, index) => (
                <View key={index} style={styles.participant}>
                  <Text style={styles.participantText}>{participant}</Text>
                </View>
                ))}
                {extraParticipants > 0 && (
                  <Text style={styles.extraParticipants}>+{extraParticipants}</Text>
                )}
              </View>
            </View>
        </View>

        <View style={styles.grayBG}>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetText}>초기화</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitText}>일정 등록 완료</Text>
              </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayBG,
    marginTop: 64,
  },
  grayBG: {
    backgroundColor: colors.lightGrayBG,
  },
  headerBox: {
    backgroundColor: colors.white,
    width: SCREEN_WIDTH,
    height: 118,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    position: 'absolute',
    top: 24,             
    left: 25,           
    marginBottom: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    height: 26,
  },
  headerDetails: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    height: 18,
  },
  meetingDuration: {
    fontSize: 12,
    color: colors.fontGray,
    marginRight: 8,
  },
  devide: {
    color: colors.lightGray,
  },
  meetingDate: {
    fontSize: 12,
    color: colors.fontGray,
  },
  participantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    width: 314,
  },
  participant: {
    backgroundColor: colors.coolGrayBlue,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 4,
    marginBottom: 8,
    width: 44,
    height: 16,
  },
  participantText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '600',
  },
  extraParticipants: {
    color: colors.coolGrayBlue,
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.lightGrayBG,
    position: 'absolute',
    top: 552,
    left: 20,
    right: 20,
  },
  resetButton: {
    flex: 1, // 1의 비율
    backgroundColor: colors.ButtonDisableGray,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // 두 버튼 사이에 10px의 간격
  },
  resetText: {
    fontSize: 14,
    color: colors.fontGray,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2, // 2의 비율
    backgroundColor: colors.buttonAfterColor,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
});

export default ScheduleScreen;
