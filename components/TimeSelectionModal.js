import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../styles/colors';
import ButtonComponent from '../components/Button';
import TimePicker from '../components/TimePicker';

const TimeSelectionModal = ({ visible, toggleModal, selectedDate, onApplyTimeSelection }) => {
  const { date, dayOfWeek, startTime: selectedStartTime = '-', endTime: selectedEndTime = '-' } = selectedDate || {};

  // 시간을 변환하는 함수
  const formatTime = (time) => {
    if (time === '-' || !time.includes('시')) return '-';
    const [period, timePart] = time.split(' ');
    const [hour, minute] = timePart.split('시');
    return `${period} ${parseInt(hour, 10)}:${minute.trim().replace('분', '') || '00'}`;
  };

  const [startTime, setStartTime] = useState(formatTime(selectedStartTime));
  const [endTime, setEndTime] = useState(formatTime(selectedEndTime));

  const handleApply = () => {
    console.log("Selected Start Time:", startTime);  // 시작 시간 로그
    console.log("Selected End Time:", endTime);      // 종료 시간 로그
    // 선택된 시작 시간과 종료 시간을 부모 컴포넌트로 전달
    onApplyTimeSelection(startTime, endTime);
    toggleModal(); // 모달 닫기
  };

  // 적용하기 버튼 활성화 여부
  const isApplyButtonActive = () => {
    if (startTime === '-' || endTime === '-') return false; // 둘 중 하나라도 없으면 비활성화
    const startHour = parseInt(startTime.split(' ')[1].split(':')[0], 10);
    const endHour = parseInt(endTime.split(' ')[1].split(':')[0], 10);
    const startPeriod = startTime.split(' ')[0];
    const endPeriod = endTime.split(' ')[0];
    
    // 같은 오전/오후에 있을 경우 시작 시간이 종료 시간보다 크면 안됨
    if (startPeriod === endPeriod && startHour > endHour) {
      return false;
    }

    return true;
  };

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={800}
      animationOutTiming={800}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.modalStart}></View>
        <Text style={styles.modalDateText}>
          {selectedDate ? `${selectedDate.date}. ${selectedDate.dayOfWeek}` : ''}
        </Text>

        {/* 타임피커 */}
        <TimePicker
          style={{ marginTop: 4, alignSelf: 'center' }}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />

        {/* 적용하기 버튼 */}
        <ButtonComponent
          title="적용하기"
          style={styles.applyButton}
          isActive={isApplyButtonActive()}
          onPress={handleApply}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    position: 'relative',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: 424,
    width: Dimensions.get('window').width,
  },
  modalStart: {
    width: 75,
    height: 4,
    borderRadius: 10,
    backgroundColor: colors.calendarColor,
    alignSelf: 'center',
    marginTop: -6,
  },
  modalDateText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 15,
    marginTop: 15,
    color: colors.black,
    alignSelf: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  applyButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 40,
  },
});

export default TimeSelectionModal;
