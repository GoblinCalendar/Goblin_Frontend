import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';
import TimeConfirmGrid from '../../components/TimeConfirmGrid';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import ButtonComponent from '../../components/Button';
import CandidateListModal from '../../components/CandidateListModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../lib/api';

// /api/groups/{groupId}/calendar/{calendarId}/available-times

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleConfirmScreen = () => {
  const router = useRouter();
  const maxParticipantsToShow = 6;
  const [participants, setParticipants] = useState([]);
  const extraParticipants = participants.length - maxParticipantsToShow;
  const [headerText, setHeaderText] = useState('프론트엔드 회의'); // 이거불러오기
  const [isModalVisible, setModalVisible] = useState(false);
  
  // const { groupId, calendarId } = useGlobalSearchParams();
  const groupId = '4';  // 임의의 그룹 ID
  const calendarId = '65';  // 임의의 캘린더 ID

  // TimeConfirmGrid에 접근하기 위한 ref 생성
  const timeConfirmGridRef = useRef(null);

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // 모달 열고 닫기 토글
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerBox}>
            <View style={styles.header}>
            <Text style={styles.headerText}>{headerText}</Text>
            <View style={styles.headerDetails}>
                <Text style={styles.meetingDuration}>2시간 00분</Text> {/*가져 오기*/}
                <Text style={styles.devide}> | </Text>
                <Text style={styles.meetingDate}>24.10.14 ~ 24.10.18</Text> {/*가져 오기*/}
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
            <TimeConfirmGrid ref={timeConfirmGridRef}/>

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
    top: 545,
    right: 20,
    alignSelf: 'center',
  },
});

export default ScheduleConfirmScreen;
