import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import ButtonComponent from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import colors from '../../../styles/colors';
import 'moment/locale/ko'; // 한국어 설정 추가

// Locale 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

const buttonWidth = 335; 

const EventDateScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('기간을 선택해주세요');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState('-');
  const [endTime, setEndTime] = useState('-');
  const [selectedTime, setSelectedTime] = useState({ hour: '1', minute: '00', ampm: '오전' });
  const [pickerType, setPickerType] = useState('');
  const [isTextCentered, setIsTextCentered] = useState(true); // 텍스트 초기 정렬 상태
  const router = useRouter();
  const { width } = useWindowDimensions(); 
  const horizontalPadding = (width - buttonWidth) / 2; 

  const handleDayPress = (day) => {
    let newSelectedDates = { ...selectedDates };

    if (!startDay || (startDay && endDay)) {
      // 새로운 시작일 지정
      setStartDay(day.dateString);
      setEndDay(null);
      newSelectedDates = {
        ...newSelectedDates,
        [day.dateString]: { startingDay: true, endingDay: true, color: colors.buttonAfterColor }
      };
    } else {
      // 연속 날짜 선택 또는 단일 날짜 추가
      const markedDates = {};
      let currentDate = startDay;
      while (currentDate <= day.dateString) {
        markedDates[currentDate] = {
          color: colors.buttonAfterColor,
          textColor: 'white',
          ...(currentDate === startDay && { startingDay: true }),
          ...(currentDate === day.dateString && { endingDay: true }),
        };
        currentDate = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)).toISOString().split('T')[0];
      }
      newSelectedDates = { ...newSelectedDates, ...markedDates };
      setEndDay(day.dateString);
    }

    setSelectedDates(newSelectedDates);
  };

  const handleNextPress = () => {
    if (Object.keys(selectedDates).length > 0) {
      router.push('/createEventHostView/eventPeople');
    }
  };

  const handleToggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleReset = () => {
    setSelectedDates({});
    setStartDay(null);
    setEndDay(null);
    setSelectedText('기간을 선택해주세요');
    setIsTextCentered(true);
  };

  const handleComplete = () => {
    const dateArray = Object.keys(selectedDates).sort();
    const groupedDates = [];
    let tempGroup = [dateArray[0]];
  
    for (let i = 1; i < dateArray.length; i++) {
      const prevDate = new Date(tempGroup[tempGroup.length - 1]);
      const currentDate = new Date(dateArray[i]);
      
      // 날짜 차이가 1일이면 같은 그룹으로 묶음
      if ((currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
        tempGroup.push(dateArray[i]);
      } else {
        groupedDates.push([...tempGroup]);
        tempGroup = [dateArray[i]];
      }
    }
    groupedDates.push([...tempGroup]);
  
    // 그룹화된 날짜들을 문자열로 변환
    const dateStrings = groupedDates.map(group => {
      if (group.length === 1) {
        return `${new Date(group[0]).getMonth() + 1}.${new Date(group[0]).getDate()}`;
      } else {
        const start = new Date(group[0]);
        const end = new Date(group[group.length - 1]);
        return `${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`;
      }
    });
  
    setSelectedText(dateStrings.join(' | '));
    setIsCalendarVisible(false);
    setIsTextCentered(false); // 텍스트 정렬 상태 변경
  };

  const openTimePicker = (type) => {
    setPickerType(type);
    setIsTimePickerVisible(true);
  };

  const handleTimePickerConfirm = () => {
    if (pickerType === 'start') {
      setStartTime(`${selectedTime.ampm} ${selectedTime.hour} : ${selectedTime.minute}`);
    } else {
      setEndTime(`${selectedTime.ampm} ${selectedTime.hour} : ${selectedTime.minute}`);
    }
    setIsTimePickerVisible(false);
  };

  const renderHeader = (date) => {
    const year = date?.getFullYear() || '';
    const month = date ? date.getMonth() + 1 : '';
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{`${year} ${month}월`}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { width }]}>
      <BackButton navigateTo='/createEventHostView/eventTime'/>
      <Text style={styles.titleText}>
        기간 및 시간의 범위를 {"\n"}
        설정해 주세요
      </Text>
      <Text style={styles.subTitleText}>연속된 일자 혹은 따로 떨어진 일자로도 선택 가능해요!</Text>

      <TouchableOpacity style={styles.dateButton} onPress={handleToggleCalendar}>
        <View style={styles.frameChild} />
        <Image style={styles.icon} resizeMode="cover" source={require('../../../assets/calendar.png')} />
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.text, 
              { textAlign: 'center', color: isTextCentered ? colors.gray : colors.black }
            ]}
            numberOfLines={1} // 한 줄로 표시
            ellipsizeMode="tail" // 텍스트가 길어지면 끝에 '...' 추가
          >
            {selectedText}
          </Text>
        </View>
      </TouchableOpacity>

      {isCalendarVisible && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType={'period'}
            theme={{
              selectedDayBackgroundColor: colors.buttonAfterColor,
              todayTextColor: colors.black,
              arrowColor: colors.black,
              textDayFontWeight: 'bold',
              textSectionTitleColor: colors.gray,
              selectedDayTextColor: colors.white,
              textMonthFontWeight: 'bold',
              textMonthColor: 'black',
            }}
            style={styles.calendar}
            locale={'ko'}
            renderHeader={renderHeader} // 커스텀 헤더 렌더링
          />
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleReset}>
              <Text style={[styles.footerText, styles.footerTextReset]}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleComplete}>
              <Text style={[styles.footerText, styles.footerTextComplete]}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isCalendarVisible && (
        <View style={styles.timeSelection}>
          <Image style={styles.icon} source={require('../../../assets/clock.png')} />
          <Text style={styles.timeText}>시작</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('start')}>
            <Text style={styles.startTimeText}>{startTime}</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.gray, fontSize: 16 }}> |  </Text>
          <Text style={styles.timeText}>종료</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('end')}>
            <Text style={styles.endTimeText}>{endTime}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 시간선택 픽커뷰 */}
      {isTimePickerVisible && (
        <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={() => {
          handleTimePickerConfirm();
          setIsTimePickerVisible(false);
        }}
        >
        <View style={styles.allpickerContainer}>
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
        </View>
        </TouchableOpacity>
      )}

      <ButtonComponent
        title="다음"
        style={[styles.button, { left: horizontalPadding }]}
        isActive={Object.keys(selectedDates).length > 0 && startTime !== '-' && endTime !== '-'}
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
  dateButton: {
    position: 'absolute',
    top: 260, 
    left: 30,
    width: buttonWidth,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    padding: 8,
  },
  frameChild: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
    backgroundColor: colors.calendarColor,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center', // 수평 가운데 정렬
    width: '100%',
    position: 'absolute',
    left: 0,
  },
  text: {
    fontSize: 14,
    position: 'absolute',
  },
  calendarContainer: {
    position: 'absolute',
    top: 320,
    left: 20,
    width: '90%',
    paddingHorizontal:10,
    backgroundColor: colors.calendarColor,
    borderRadius: 15,
    padding: 10,
  },
  calendar: {
    borderRadius: 15, 
    padding: 5,
    backgroundColor: colors.white,
  },
  header: {
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 13,
    color: colors.buttonAfterColor,
  },
  footerTextReset: {
    color: colors.black,
  },
  timeSelection: {
    position: 'absolute',
    top: 320, 
    left: 30,
    width: buttonWidth,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    padding: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 80,
    height: 26,
    justifyContent: 'center',
    marginHorizontal: 10, // 좌우 간격
  },
  timeText: {
    fontSize: 14,
    color: colors.black,
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
  allpickerContainer: {
    backgroundColor: colors.buttonBeforeColor,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 12,
    padding: 10,
    position: 'absolute',
    top: 360,
    left: 20,
    width: '90%',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingBottom: 15,
    borderRadius: 12,
    marginHorizontal: 5,
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
    paddingHorizontal: 10,
  },
  button: {
    position: 'absolute',
    top: 714,
  },
});

export default EventDateScreen;
