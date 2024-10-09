// ScheduleScreen.js
import React, { useRef, useState  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';
import TimeSelectionGrid from '../../components/TimeSelectionGrid';
import { useRouter } from 'expo-router';

const participants = ['홍길동', '김철수', '이영희', '박민수', '최진영', '정다은', '이현우'];

// /api/groups/{groupId}/calendar/{calendarId}/available-time
// /api/groups/{groupId}/calendar/{calendarId}/participants

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleScreen = () => {
  const router = useRouter();
  const maxParticipantsToShow = 6;
  const extraParticipants = participants.length - maxParticipantsToShow;

  const [headerText, setHeaderText] = useState('2차 대면 회의');
  
  // TimeSelectionGrid에 접근하기 위한 ref 생성
  const timeSelectionGridRef = useRef(null);

  // 일정 등록 완료 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = () => {
    console.log(headerText);
    router.push(`/joinEventGuestView/joinEventComplete?headerText=${encodeURIComponent(headerText)}`);
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
                <Text style={styles.meetingDuration}>1시간 30분</Text>
                <Text style={styles.devide}> | </Text>
                <Text style={styles.meetingDate}>24.09.10 ~ 24.09.15</Text>
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
            <TimeSelectionGrid ref={timeSelectionGridRef}/>

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
