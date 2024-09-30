// ScheduleScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';
import TimeSelectionGrid from '../../components/TimeSelectionGrid';  // 컴포넌트 import

const participants = ['홍길동', '김철수', '이영희', '박민수', '최진영', '정다은', '이현우'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleScreen = () => {
  const maxParticipantsToShow = 6;
  const extraParticipants = participants.length - maxParticipantsToShow;

  return (
    <View style={styles.container}>
        <View style={styles.headerBox}>
            <View style={styles.header}>
            <Text style={styles.headerText}>2차 대면 회의</Text>
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
            <TimeSelectionGrid />

            <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetText}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
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
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
  },
  resetText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#00AEEF',
    borderRadius: 24,
  },
  submitText: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default ScheduleScreen;
