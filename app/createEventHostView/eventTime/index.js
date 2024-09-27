// eventTime/index.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import BackButton from '../../../components/BackButton';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const durations = ['30분', '1시간', '2시간', '3시간', '1시간 30분', '2시간 30분', '3시간 30분'];
const buttonWidth = 335; // 버튼의 고정 너비

const EventTimeScreen = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [customHour, setCustomHour] = useState('1');
  const [customMinute, setCustomMinute] = useState('00');
  const router = useRouter();
  const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
  const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산

  const handleTimePress = (duration) => { // 시간버튼 이미 선택된 시간인 경우 선택 해제
    if (selectedTime === duration) {
      setSelectedTime('');
    } else {
      setSelectedTime(duration);
      setIsTimePickerVisible(false);
    }
  };

  const handleDetailPress = () => {
    setSelectedTime(''); // 선택한 타임 버튼 해제
    setIsTimePickerVisible(true); // Picker 보이기
  };  

  const handleNextPress = () => {
    if (selectedTime) {
      router.push('/createEventHostView/eventDate');
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* BackButton 컴포넌트 */}
      <BackButton />

      {/* 타이틀 문구 */}
      <Text style={styles.titleText}>
        일정의 예상 소요 시간이{"\n"}
        어떻게 될까요?
      </Text>

      {/* 서브 타이틀 문구 */}
      <Text style={styles.subTitleText}>
        대략적으로 예상 소요 시간을 정해도 괜찮아요!
      </Text>

      {/* 시간 선택 버튼들 */}
      <View style={styles.timeContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.timeButton,
              selectedTime === duration && styles.selectedButton,
            ]}
            onPress={() => handleTimePress(duration)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === duration && styles.selectedTimeText,
              ]}
            >
              {duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 상세 시간 설정 버튼 */}
      {!isTimePickerVisible && (
        <TouchableOpacity
          style={[styles.detailButton, { left: horizontalPadding }]}
          onPress={handleDetailPress} // 상세 시간 설정 버튼 클릭 시
        >
          <View style={styles.rectangle}>
            <View style={styles.detailContainer}>
              <Image style={styles.icon} source={require('../../../assets/clock.png')} />
              <Text style={styles.detailText}>상세 시간 설정</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* 타임 피커 */}
      {isTimePickerVisible && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={customHour}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setCustomHour(itemValue)}
          >
            {[...Array(6).keys()].map((i) => (
              <Picker.Item key={i} label={`${i}시간`} value={`${i}`} />
            ))}
          </Picker>
          <Text style={styles.colonText}>:</Text>
          <Picker
            selectedValue={customMinute}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setCustomMinute(itemValue)}
          >
            {['00', '15', '30', '45'].map((minute) => (
              <Picker.Item key={minute} label={`${minute}분`} value={minute} />
            ))}
          </Picker>
        </View>
      )}

      {/* 다음 버튼 */}
      <ButtonComponent
        title="다음"
        style={[styles.button, { left: horizontalPadding }]}
        isActive={!!selectedTime || isTimePickerVisible} // 선택한 시간이 있으면 활성화
        onPress={handleNextPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative', 
    alignSelf: 'center', 
  },
  titleText: {
    position: 'absolute',
    top: 132,
    left: 25,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 34,
    color: colors.black,
    textAlign: 'left',
  },
  subTitleText: {
    position: 'absolute',
    top: 210,
    left: 25,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'left',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
    position: 'absolute',
    top: 196,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: colors.buttonBeforeColor,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.buttonAfterColor,
  },
  timeText: {
    fontSize: 16,
    color: colors.gray,
  },
  selectedTimeText: {
    color: colors.white,
  },
  detailButton: {
    position: 'absolute',
    top: 378, // 위치 설정
  },
  rectangle: {
    borderRadius: 12,
    backgroundColor: '#e3eff5',
    width: 335,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8, // 아이콘과 텍스트 간격 설정
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5daed6',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.buttonBeforeColor,
    borderRadius: 12,
    padding: 10,
    position: 'absolute',
    top: 370,
    left: 25,
  },
  picker: {
    width: 150,
    height: 180,
    backgroundColor : colors.white,
    borderRadius: 12,
  },
  pickerItem: {
    height: 180, // 원하는 높이 설정
    fontSize: 20, // 원하는 폰트 크기 설정
  },
  colonText: {
    fontSize: 25,
    color: colors.gray,
    paddingHorizontal: 10,
  },
  button: {
    position: 'absolute',
    top: 714, 
  },
});

export default EventTimeScreen;
