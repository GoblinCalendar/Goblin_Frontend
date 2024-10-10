import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';
import TimeSelectionGrid from '../../components/TimeSelectionGrid';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../lib/api';

// /api/groups/{groupId}/calendar/{calendarId}/available-time

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleScreen = () => {
  const router = useRouter();
  const maxParticipantsToShow = 6;
  const [participants, setParticipants] = useState([]);  // 참가자 데이터를 저장할 상태
  const extraParticipants = participants.length - maxParticipantsToShow;

  const [headerText, setHeaderText] = useState(''); // 헤더 텍스트 상태
  const [meetingDuration, setMeetingDuration] = useState(''); // 회의 시간 상태
  const [meetingDate, setMeetingDate] = useState(''); // 선택된 날짜 상태
  const [selectedTimeRanges, setSelectedTimeRanges] = useState([]); // 선택된 시간 범위 상태 추가
  const timeSelectionGridRef = useRef(null);  // TimeSelectionGrid에 대한 ref 생성

  // const { groupId, calendarId } = useGlobalSearchParams();
  const groupId = '2';  // 임의의 그룹 ID
  const calendarId = '81';  // 임의의 캘린더 ID

  console.log("Group ID:", groupId);
  console.log("Calendar ID:", calendarId);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        // 참가자 정보를 API로 호출
        const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}/participants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 참가자 이름만 추출 후 중복 제거
        const uniqueParticipants = [...new Set(response.data.map(participant => participant.username))];

        setParticipants(uniqueParticipants);
      } catch (error) {
        console.error('참가자 정보를 가져오는 중 오류 발생:', error);
      }
    };

    if (groupId && calendarId) {
      fetchParticipants();  // groupId와 calendarId가 있을 때 참가자 데이터를 가져옴
    }
  }, [groupId, calendarId]);

  useEffect(() => {
    const fetchCalendarDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        
        // 그룹과 캘린더의 세부 정보 API 호출
        const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // API 응답을 로그로 출력
        console.log('캘린더 API 응답:', response.data);

        // headerText 업데이트 (일정 제목)
        setHeaderText(response.data.title);
  
        // meetingDuration 업데이트 (분을 시간으로 변환)
        const totalMinutes = response.data.time;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setMeetingDuration(`${hours}시간 ${minutes === 0 ? '00' : minutes}분`);
  
        // meetingDate 업데이트 (선택된 날짜 범위)
        const selectedDates = response.data.selectedDates;
        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[selectedDates.length - 1]);
        const formattedStartDate = `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}`;
        const formattedEndDate = `${endDate.getFullYear()}.${endDate.getMonth() + 1}.${endDate.getDate()}`;
        setMeetingDate(`${formattedStartDate} ~ ${formattedEndDate}`);
  
      } catch (error) {
        console.error('캘린더 세부 정보를 가져오는 중 오류 발생:', error);
  
        // 에러 응답 본문을 로그에 출력
        if (error.response) {
          console.error('에러 상태 코드:', error.response.status); // 상태 코드
          console.error('에러 메시지:', error.response.data); // 에러 응답 본문
        } else {
          console.error('응답을 받지 못했습니다. 네트워크 오류일 수 있습니다.');
        }
      }
    };
  
    if (groupId && calendarId) {
      fetchCalendarDetails();  // groupId와 calendarId가 있을 때 캘린더 세부 정보 가져옴
    }
  }, [groupId, calendarId]);

  // TimeSelectionGrid에서 선택한 시간 데이터를 받을 함수
  const handleTimeChange = (newTimeRange) => {
    setSelectedTimeRanges((prevRanges) => {
      const updatedRanges = [...prevRanges];
      const existingIndex = updatedRanges.findIndex(range => range.date === newTimeRange.date);

      if (existingIndex !== -1) {
        // 같은 날짜가 이미 존재하면 그 값을 갱신
        updatedRanges[existingIndex] = newTimeRange;
      } else {
        // 새로운 날짜는 배열에 추가
        updatedRanges.push(newTimeRange);
      }

      // 로그에 날짜, 선택 시작 시간, 선택 끝 시간을 출력
      console.log(`저장된 날짜 범위: `, updatedRanges);
      return updatedRanges;
    });
  };
  
  // 일정 등록 완료 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      const formattedTimeSlots = selectedTimeRanges.map(range => {
        // 시간을 적절한 형식으로 변환
        const startAmPm = range.start.includes('오전') ? 'AM' : 'PM';
        const endAmPm = range.end.includes('오전') ? 'AM' : 'PM';
  
        // 정규식을 사용해 시간과 분을 추출
        const startMatch = range.start.match(/(\d+)\s*시\s*(\d+)?\s*분/);
        const endMatch = range.end.match(/(\d+)\s*시\s*(\d+)?\s*분/);

        // 값이 있을 때만 숫자로 변환하고 없으면 0으로 처리
        const startHour = startMatch ? parseInt(startMatch[1], 10) : 0;
        const startMinute = startMatch && startMatch[2] ? parseInt(startMatch[2], 10) : 0;

        const endHour = endMatch ? parseInt(endMatch[1], 10) : 0;
        const endMinute = endMatch && endMatch[2] ? parseInt(endMatch[2], 10) : 0;
  
        return {
          date: `2024-${range.date.replace('.', '').replace(' ', '-')}`, // '10. 12' => '2024-10-12'
          startAmPm,
          startHour,
          startMinute,
          endAmPm,
          endHour,
          endMinute,
        };
      });

      console.log("formattedTimeSlots: ", formattedTimeSlots);
  
      const body = {
        availableTimeSlots: formattedTimeSlots,
      };
  
      const response = await apiClient.post(`/api/groups/${groupId}/calendar/${calendarId}/available-time`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('Response message:', response.data);  // '가능한 시간이 제출되었습니다.' 메시지
        router.push(`/joinEventGuestView/joinEventComplete?headerText=${encodeURIComponent(headerText)}`);
      }
    } catch (error) {
      console.log("headerText: ",headerText);
      console.error('시간 제출 중 오류 발생:', error);
    }
  };

  // 초기화 버튼을 눌렀을 때 호출되는 함수
  const handleReset = () => {
    if (timeSelectionGridRef.current) {
      timeSelectionGridRef.current.resetSelection();  // 선택한 시간 초기화
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerBox}>
            <View style={styles.header}>
            <Text style={styles.headerText}>{headerText}</Text>
            <View style={styles.headerDetails}>
                <Text style={styles.meetingDuration}>{meetingDuration}</Text>
                <Text style={styles.devide}> |   </Text>
                <Text style={styles.meetingDate}>{meetingDate}</Text>
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
            {/* 시간 선택 그리드 컴포넌트 사용 */}
            <TimeSelectionGrid
              ref={timeSelectionGridRef}
              calendarId={calendarId}
              groupId={groupId}
              onTimeChange={handleTimeChange}
            />

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
