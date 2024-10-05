import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ButtonComponent from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import colors from '../../../styles/colors';
import 'moment/locale/ko'; // 한국어 설정 추가
import { EventContext } from '../../../context/EventContext';
import TimePicker from '../../../components/TimePicker';
import CalendarPicker from '../../../components/CalendarPicker';

const buttonWidth = 335; 

const EventDateScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('기간을 선택해주세요');
  const [startTime, setStartTime] = useState('-');
  const [endTime, setEndTime] = useState('-');
  const [isTextCentered, setIsTextCentered] = useState(true); // 텍스트 초기 정렬 상태
  const router = useRouter();
  const { width } = useWindowDimensions(); 
  const horizontalPadding = (width - buttonWidth) / 2; 
  const { setEventDetails } = useContext(EventContext);

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

      if ((currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
        tempGroup.push(dateArray[i]);
      } else {
        groupedDates.push([...tempGroup]);
        tempGroup = [dateArray[i]];
      }
    }
    groupedDates.push([...tempGroup]);

    const dateStrings = groupedDates.map(group => {
      if (group.length === 1) {
        return `${new Date(group[0]).getMonth() + 1}.${new Date(group[0]).getDate()}`;
      } else {
        const start = new Date(group[0]);
        const end = new Date(group[group.length - 1]);
        return `${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`;
      }
    });

    setEventDetails((prevDetails) => ({
      ...prevDetails,
      dates: dateArray,
    }));

    setSelectedText(dateStrings.join(' ㅣ '));
    setIsCalendarVisible(false);
    setIsTextCentered(false);
  };

  const handleNextPress = () => {
    if (Object.keys(selectedDates).length > 0 && startTime !== '-' && endTime !== '-') {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        startTime: startTime,
        endTime: endTime,
      }));
      router.push('/createEventHostView/eventPeople');
    }
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
        <CalendarPicker
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          startDay={startDay}
          setStartDay={setStartDay}
          endDay={endDay}
          setEndDay={setEndDay}
          handleComplete={handleComplete}
          handleReset={handleReset}
          style={styles.calendarPicker}
        />
      )}

      {!isCalendarVisible && (
        <TimePicker
          style={{ position: 'absolute', left: 30, top: 312 }}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />
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
    backgroundColor: colors.white,
    position: 'relative', 
  },
  titleText: {
    position: 'absolute',
    top: 132,
    left: 25,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 34,
    color: colors.black,
    textAlign: 'left',
  },
  subTitleText: {
    position: 'absolute',
    top: 206,
    left: 25,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'left',
  },
  dateButton: {
    position: 'absolute',
    top: 260, 
    left: 30,
    width: buttonWidth,
    height: 40,
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
  calendarPicker: {
    position: 'absolute',
    top: 320,
    left: 20,
  },
  button: {
    position: 'absolute',
    top: 714,
  },
});

export default EventDateScreen;
