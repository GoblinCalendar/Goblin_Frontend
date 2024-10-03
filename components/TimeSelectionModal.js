import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import colors from '../styles/colors';
import ButtonComponent from '../components/Button';

const TimeSelectionModal = ({ visible, toggleModal, selectedDate, onApplyTimeSelection }) => {
  const [selectedTime, setSelectedTime] = useState({ hour: '1', minute: '00', ampm: '오전' });
  const [pickerType, setPickerType] = useState('');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

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

  // 타임피커 열기 (시작 시간/종료 시간 구분)
  const openTimePicker = (type) => {
    setPickerType(type);
    setIsTimePickerVisible(true);
  };

  // 타임피커에서 선택한 값을 처리
  const handleTimePickerConfirm = () => {
    if (pickerType === 'start') {
      setStartTime(`${selectedTime.ampm} ${selectedTime.hour} : ${selectedTime.minute}`);
    } else if (pickerType === 'end') {
      setEndTime(`${selectedTime.ampm} ${selectedTime.hour} : ${selectedTime.minute}`);
    }
    setIsTimePickerVisible(false); // 피커 닫기
  };

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

        {/* 시간 선택 */}
        <View style={styles.timeSelection}>
          <Image style={styles.icon} source={require('../assets/clock.png')} />
          <Text style={styles.timeText}>시작</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('start')}>
            <Text style={styles.startTimeText}>{startTime}</Text>
          </TouchableOpacity>
          <Text style={styles.devide}>ㅣ</Text>
          <Text style={[styles.timeText, { marginLeft: 10 }]}>종료</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('end')}>
            <Text style={styles.endTimeText}>{endTime}</Text>
          </TouchableOpacity>
        </View>

        {/* 타임피커 */}
        {isTimePickerVisible && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.allpickerContainer}
              activeOpacity={1}
              onPress={() => handleTimePickerConfirm()}
            >
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTime.ampm}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, ampm: value }))}
                >
                  <Picker.Item label="오전" value="오전" />
                  <Picker.Item label="오후" value="오후" />
                </Picker>
                <Picker
                  selectedValue={selectedTime.hour}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, hour: value }))}
                >
                  {[...Array(12).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                  ))}
                </Picker>
                <Text style={styles.colonText}>:</Text>
                <Picker
                  selectedValue={selectedTime.minute}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, minute: value }))}
                >
                  {['00', '15', '30', '45'].map((minute) => (
                    <Picker.Item key={minute} label={minute} value={minute} />
                  ))}
                </Picker>
              </View>
            </TouchableOpacity>
          </View>
        )}

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
  timeSelection: {
    marginBottom: 5,
    width: 335,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    padding: 8,
    alignSelf: 'center',
  },
  devide: {
    color: colors.gray, 
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 2
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 80,
    height: 26,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  startTimeText: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
  },
  endTimeText: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 335,
    alignSelf: 'center',
  },
  allpickerContainer: {
    backgroundColor: colors.buttonBeforeColor,
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
  },
  picker: {
    width: 100,
    height: 180,
  },
  pickerItem: {
    height: 180, 
    fontSize: 20,
  },
  colonText: {
    fontSize: 25,
    color: colors.gray,
    paddingHorizontal: 5,
  },
  applyButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default TimeSelectionModal;
