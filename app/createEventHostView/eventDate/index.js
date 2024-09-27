import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import ButtonComponent from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import colors from '../../../styles/colors';

const buttonWidth = 335;

const EventDateScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const horizontalPadding = (width - buttonWidth) / 2;

  const handleDayPress = (day) => {
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[day.dateString]) {
      delete newSelectedDates[day.dateString];
    } else {
      newSelectedDates[day.dateString] = {
        periods: [
          { startingDay: true, endingDay: true, color: colors.buttonAfterColor },
        ],
      };
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

  return (
    <View style={[styles.container, { width }]}>
      <BackButton />
      <Text style={styles.titleText}>
        기간 및 시간의 범위를 {"\n"}
        설정해 주세요
      </Text>
      <Text style={styles.subTitleText}>연속된 일자 혹은 따로 떨어진 일자로도 선택 가능해요!</Text>

      <TouchableOpacity style={styles.dateButton} onPress={handleToggleCalendar}>
        <View style={styles.frameChild} />
        <Image style={styles.icon} resizeMode="cover" source={require('../../../assets/calendar.png')} />
        <Text style={styles.text}>기간을 선택해주세요</Text>
      </TouchableOpacity>

      {isCalendarVisible && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType={'multi-period'} // 다중 선택을 위한 markingType 설정
            theme={{
              selectedDayBackgroundColor: colors.buttonAfterColor,
              todayTextColor: colors.black,
              arrowColor: colors.black,
              textDayFontWeight: 'bold',
              textSectionTitleColor: colors.gray,
              selectedDayTextColor: colors.white,
            }}
            style={styles.calendar}
          />
        </View>
      )}

      <ButtonComponent
        title="다음"
        style={[styles.button, { left: horizontalPadding }]}
        isActive={Object.keys(selectedDates).length > 0}
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
  text: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  calendarContainer: {
    position: 'absolute',
    top: 320,
    width: '100%',
    paddingHorizontal: 10,
  },
  calendar: {
    borderRadius: 15, 
    padding: 10,
    backgroundColor: colors.calendarColor,
  },
  button: {
    position: 'absolute',
    top: 714,
  },
});

export default EventDateScreen;
