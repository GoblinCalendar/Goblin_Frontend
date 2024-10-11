import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';
import TimeConfirmGrid from '../../components/TimeConfirmGrid';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import ButtonComponent from '../../components/Button';
import CandidateListModal from '../../components/CandidateListModal';
import CandidateListConfirmModal from '../../components/CandidateListConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../lib/api';

// /api/groups/{groupId}/calendar/{calendarId}/available-times

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleConfirmScreen = () => {
  const router = useRouter();
  const maxParticipantsToShow = 6;
  const [participants, setParticipants] = useState([]);
  const extraParticipants = participants.length - maxParticipantsToShow;
  const [headerText, setHeaderText] = useState(''); // 헤더 텍스트 상태
  const [meetingDuration, setMeetingDuration] = useState(''); // 회의 시간 상태
  const [meetingDate, setMeetingDate] = useState(''); // 선택된 날짜 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // 확정 모달 상태
  const [selectedSchedule, setSelectedSchedule] = useState(null); // 선택된 일정
  
  const { groupId, calendarId } = useGlobalSearchParams();
  // const groupId = '4';  // 임의의 그룹 ID
  // const calendarId = '65';  // 임의의 캘린더 ID

  // TimeConfirmGrid에 접근하기 위한 ref 생성
  const timeConfirmGridRef = useRef(null);

  useEffect(() => {
    console.log('isConfirmModalVisible:', isConfirmModalVisible);  // 상태 변화를 확인
}, [isConfirmModalVisible]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}/participants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 참가자 데이터 저장
        setParticipants(response.data.map(participant => participant.username));
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, []);

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
        setMeetingDuration(`${hours}시간 ${minutes === 0 ? '' : minutes분}`);
  
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

  const toggleModal = () => {
    console.log('Modal state toggled');
    setModalVisible(!isModalVisible); // 모달 열고 닫기 토글
  };

  const openConfirmModal = (selectedSchedule) => {
    console.log('Selected Schedule:', selectedSchedule); // 선택된 일정 로그 출력
    setSelectedSchedule(selectedSchedule); // 선택된 일정 저장
    setConfirmModalVisible(true); // 확정 모달 열기
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerBox}>
            <View style={styles.header}>
            <Text style={styles.headerText}>{headerText}</Text>
            <View style={styles.headerDetails}>
                <Text style={styles.meetingDuration}>{meetingDuration}</Text>
                <Text style={styles.devide}> | </Text>
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
            <TimeConfirmGrid ref={timeConfirmGridRef} groupId={groupId} calendarId={calendarId} />

            <View style={styles.footer}>
                <ButtonComponent 
                title="일정 확정하러 가기 >" 
                style={styles.button} 
                isActive={true} 
                onPress={toggleModal} 
                />
            </View>
        </View>

        {/* 모달 컴포넌트 */}
        <CandidateListModal
            visible={isModalVisible}
            toggleModal={toggleModal}
            groupId={groupId} 
            calendarId={calendarId}
            meetingDuration={meetingDuration}
            openConfirmModal={openConfirmModal}
        />

        {/* CandidateListConfirmModal을 모달로 추가 */}
        <CandidateListConfirmModal
          visible={isConfirmModalVisible}
          toggleModal={() => setConfirmModalVisible(!isConfirmModalVisible)}
          selectedSchedule={selectedSchedule} // 선택된 일정 전달
          expectedDuration={meetingDuration}
          groupId={groupId} 
          calendarId={calendarId}
        />
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
    marginRight: 0,
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
    top: 545,
    alignSelf: 'center',
  },
});

export default ScheduleConfirmScreen;
