import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import colors from '../styles/colors';
import CustomArrowButton from './ArrowButton';
import TimeDragBar from './TimeDragBar';
import TimeSelectionModal from './TimeSelectionModal';
import apiClient from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 시간 그리드 생성 함수
const generateTimeGrid = (start, end) => {
  const hours = [];
  const startHour = parseInt(start.split(':')[0], 10);
  const startMinute = parseInt(start.split(':')[1], 10);
  const endHour = parseInt(end.split(':')[0], 10);

  for (let i = startHour * 4 + startMinute / 15; i <= endHour * 4; i++) {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const period = hour < 12 ? '오전' : '오후';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute === 0 ? '00' : minute;
    hours.push(`${period} ${formattedHour}시 ${formattedMinute}분`);
  }
  return hours;
};

const TimeSelectionGrid = forwardRef((props, ref) => {
  const [visibleStartHour, setVisibleStartHour] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedStartTime, setSelectedStartTime] = useState(null); // 시작 시간을 추적
  const [selectedEndTime, setSelectedEndTime] = useState(null); // 끝 시간을 추적
  const [selectedDayForTimeSelection, setSelectedDayForTimeSelection] = useState(null); // 선택된 날짜 추적
  const [visibleStartDay, setVisibleStartDay] = useState(0); 
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [lastSelectedBlock, setLastSelectedBlock] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [days, setDays] = useState([]);
  const [dates, setDates] = useState([]);
  const [time, setTime] = useState([]);
  const [hours, setHours] = useState([]);

  // 초기화 함수
  const resetSelection = () => {
    setSelectedTimes({});
    setSelectedStartTime(null); // 초기화 시 시작 시간도 초기화
    setSelectedEndTime(null); // 끝 시간도 초기화
    setSelectedDate(null);
    setSelectedDayForTimeSelection(null);
  };

  // ref를 통해 상위 컴포넌트에서 초기화 함수를 호출할 수 있도록 함
  useImperativeHandle(ref, () => ({
    resetSelection,
  }));

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await apiClient.get(`/api/groups/${props.groupId}/calendar/${props.calendarId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const selectedDates = data.selectedDates; // ['2024-10-10', '2024-10-11'] 형태

        // selectedDates에서 요일과 날짜 추출
        const parsedDays = selectedDates.map(date => {
          const day = new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' });
          return day;
        });

        const parsedDates = selectedDates.map(date => {
          const parsedDate = new Date(date).toLocaleDateString('ko-KR', {
            month: 'numeric',
            day: 'numeric'
          });
          return parsedDate.replace(/\.$/, ''); // 마지막 마침표만 제거
        });

        // 첫 번째 selectedDateTimes 항목을 통해 시간 범위 추출
        const startTime = new Date(data.selectedDateTimes[0].startDateTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
        const endTime = new Date(data.selectedDateTimes[0].endDateTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

        setDays(parsedDays);
        setDates(parsedDates);
        setTime([startTime, endTime]); // 시간 배열 설정

        // 시간을 기반으로 그리드 생성
        const generatedHours = generateTimeGrid(startTime, endTime);
        setHours(generatedHours); // 시간 그리드를 상태로 설정
      } catch (error) {
        console.error('캘린더 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCalendarData();
  }, [props.groupId, props.calendarId]);

  // 선택된 시간 범위 변환 및 부모 컴포넌트로 전송
  const changeTimeSelection = () => {
    if (selectedStartTime && selectedEndTime && selectedDayForTimeSelection) {
      const formattedData = {
        date: selectedDayForTimeSelection, // 선택한 날짜
        start: selectedStartTime, // 선택한 시작 시간
        end: selectedEndTime, // 선택한 끝 시간
      };
      console.log("formattedData: ",formattedData);
      props.onTimeChange(formattedData); // 부모 컴포넌트로 선택된 시간 범위 전달
    }
  };

  // 시간 범위가 8시간을 넘으면 arrowButton 표시
  const showHourArrows = hours.length > 32;
  // 날짜 범위가 5일을 넘으면 arrowSideButton 표시
  const showDayArrows = days.length > 5;

  // 사용자가 선택한 시간 변환 함수
  const handleTouch = (dayIndex, hourIndex, isDragging = false) => {
    const selectedBlockTime = hours[hourIndex];
    const selectedDay = dates[visibleStartDay + dayIndex]; // 현재 선택한 날짜를 항상 추적
  
    // 다른 날짜가 선택되었을 때 시작 시간을 다시 설정하도록 초기화
    if (selectedDayForTimeSelection !== selectedDay) {
      setSelectedStartTime(null);  // 다른 날짜가 선택되면 시작 시간을 초기화
      setSelectedDayForTimeSelection(selectedDay);  // 선택한 날짜를 업데이트
    }
  
    setSelectedTimes((prev) => {
      const key = `${dayIndex}-${hourIndex}`;
      const isSelected = prev[key];
      const updatedSelection = { ...prev, [key]: !isSelected };
  
      // 처음 터치 시 한 번만 시작 시간 설정
      if (!isSelected && !selectedStartTime) {
        setSelectedStartTime(selectedBlockTime); // 처음 터치한 시간으로 시작 시간 설정
        setSelectedDayForTimeSelection(selectedDay);
        console.log(`시작 시간 설정: ${selectedBlockTime}`);
      }
  
      // 끝 시간은 항상 업데이트
      if (!isSelected) {
        setSelectedEndTime(selectedBlockTime);
      } else {
        // 시간 선택이 해제될 경우에도 끝 시간 갱신
        const remainingKeys = Object.keys(updatedSelection).filter((key) => updatedSelection[key]);
        const maxHour = Math.max(...remainingKeys.map((key) => parseInt(key.split('-')[1], 10)));
        setSelectedEndTime(hours[maxHour] || null);
      }
  
      // 선택된 시간 변경 시 바로 부모로 전송
      changeTimeSelection();
  
      // console.log(`선택한 날짜: ${selectedDay}, 선택한 시간: ${selectedBlockTime}`);
      return updatedSelection;
    });
  };

  const onGestureEvent = (dayIndex, event) => {
    const { y } = event.nativeEvent;
    const blockHeight = 12; // 15분 단위의 높이
    const hourIndex = Math.floor(y / blockHeight);

    const currentBlock = `${dayIndex}-${hourIndex + visibleStartHour}`;
    if (currentBlock !== lastSelectedBlock) {
      handleTouch(dayIndex, hourIndex + visibleStartHour, true);
      setLastSelectedBlock(currentBlock);
    }
  };

  const onGestureStart = (dayIndex, event) => {
    const { y } = event.nativeEvent;
    const blockHeight = 12;
    const hourIndex = Math.floor(y / blockHeight);

    setDragging(true);
    const currentBlock = `${dayIndex}-${hourIndex + visibleStartHour}`;
    handleTouch(dayIndex, hourIndex + visibleStartHour);
    setLastSelectedBlock(currentBlock);
  };

  const onGestureEnd = () => {
    setDragging(false); // 드래그가 끝남
  };

  const handleNextHour = () => {
    if (visibleStartHour < hours.length - 32) {
      setVisibleStartHour(visibleStartHour + 4);
    }
  };

  const handlePreviousHour = () => {
    if (visibleStartHour > 0) {
      setVisibleStartHour(visibleStartHour - 4);
    }
  };

  const handleNextDay = () => {
    if (visibleStartDay < days.length - 3) {
      setVisibleStartDay(visibleStartDay + 1);
    }
  };

  const handlePreviousDay = () => {
    if (visibleStartDay > 0) {
      setVisibleStartDay(visibleStartDay - 1);
    }
  };

  const isStartOfSelection = (dayIndex, hourIndex) => {
    return selectedTimes[`${dayIndex}-${hourIndex + visibleStartHour}`] && !selectedTimes[`${dayIndex}-${hourIndex + visibleStartHour - 1}`];
  };

  const isEndOfSelection = (dayIndex, hourIndex) => {
    return selectedTimes[`${dayIndex}-${hourIndex + visibleStartHour}`] && !selectedTimes[`${dayIndex}-${hourIndex + visibleStartHour + 1}`];
  };

  const handleDayHeaderPress = (dayIndex) => {
    // 선택된 날짜가 다시 눌리면 원래 상태로 돌아감
    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(null); // 선택 해제
      setModalVisible(false); // 모달 닫기
    } else {
      setSelectedDayIndex(dayIndex); // 새로운 선택 상태로 변경

      const selectedDate = `2024. ${dates[visibleStartDay + dayIndex]}`; // 고정된 2024년과 선택된 날짜 조합
      const dayOfWeek = days[visibleStartDay + dayIndex]; // days 배열에서 요일 가져오기

      // 선택된 시간 범위를 찾기 위한 로직
      let selectedStartTime = null;
      let selectedEndTime = null;

      for (let hourIndex = 0; hourIndex < hours.length; hourIndex++) {
        const key = `${dayIndex}-${hourIndex}`;
        if (selectedTimes[key]) {
          if (selectedStartTime === null) {
            selectedStartTime = hours[hourIndex];
          }
          selectedEndTime = hours[hourIndex];
        }
      }

      // 선택된 시간이 없으면 "시작" 및 "종료" 값을 '-'로 설정
      selectedStartTime = selectedStartTime || '-';
      selectedEndTime = selectedEndTime || '-';
      console.log(`타임피커로 보내지는 데이터 : ${selectedStartTime} , ${selectedEndTime}`);

      setSelectedDate({
        date: selectedDate,
        dayOfWeek: dayOfWeek,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      });
      setModalVisible(true); // 모달 열기
    }
  };

  // 모달에서 받아온 시간 구간 변경 함수
  const timeStringToIndex = (timeString, timeRange) => {
    const gridStartTime = timeRange[0];
    console.log(`입력된 시간 문자열: ${timeString}`);
    const [period, time] = timeString.replace(/\s+/g, ' ').trim().split(' ');
    console.log(`period: ${period}, time: ${time}`);
    const [hour, minute = '00'] = time.split(':').map(t => t.trim());
    console.log(`hour: ${hour}, minute: ${minute}`);
    let hourIndex = parseInt(hour, 10);
  
    // 오후면 시간에 12를 더해 24시간제처럼 계산 (오후 12시는 예외)
    if (period === '오후' && hourIndex !== 12) {
      hourIndex += 12;
    }
    if (period === '오전' && hourIndex === 12) {
      hourIndex = 0; // 오전 12시는 0시로 처리
    }
  
    const [gridStartHour, gridStartMinute] = gridStartTime.split(':').map(t => parseInt(t, 10));
    const totalGridStartIndex = gridStartHour * 4 + (gridStartMinute / 15);  // 그리드 시작 시간의 인덱스
    const minuteIndex = parseInt(minute, 10) / 15;
    const calculatedIndex = (hourIndex * 4 + minuteIndex) - totalGridStartIndex;  // 그리드 시작 시간에 맞게 조정된 인덱스
    
    console.log(`시간: ${timeString}, 계산된 인덱스: ${calculatedIndex}`); // 디버깅 로그
    return calculatedIndex;
  };

  const onApplyTimeSelection = (start, end) => {
    console.log(`선택한 시간 범위: ${start} - ${end}`);
    
    // 시작 시간과 종료 시간을 인덱스로 변환
    const startIndex = timeStringToIndex(start, time);  // time 배열을 전달
    const endIndex = timeStringToIndex(end, time);  // time 배열을 전달
  
    // 선택된 시간 범위에 해당하는 블록들을 업데이트
    setSelectedTimes((prevSelectedTimes) => {
      const updatedTimes = { ...prevSelectedTimes };
      for (let i = startIndex; i <= endIndex; i++) {
        updatedTimes[`${selectedDayIndex}-${i}`] = true;
      }
      return updatedTimes;
    });

    // 날짜 및 시간 데이터를 변환해서 형식에 맞게 가공
    const formattedData = formatTimeData(start, end, selectedDate);

    setSelectedDayIndex(null); // 날짜 선택 해제
    setSelectedDate(null);     // 날짜 상태 초기화
  
    setModalVisible(false); // 모달 닫기
  };

  const formatTimeData = (start, end, selectedDate) => {
    const parseTime = (timeString) => {
      const [period, time] = timeString.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      return {
        period: period === '오전' ? 'AM' : 'PM',
        hour: period === '오후' && hour !== 12 ? hour + 12 : hour === 12 && period === '오전' ? 0 : hour,
        minute: minute,
      };
    };
  
    const startTime = parseTime(start);
    const endTime = parseTime(end);
  
    // 선택된 날짜와 시간을 포맷팅하여 반환
    return {
      date: selectedDate.date,  // 선택된 날짜
      startAmPm: startTime.period,
      startHour: startTime.hour,
      startMinute: startTime.minute,
      endAmPm: endTime.period,
      endHour: endTime.hour,
      endMinute: endTime.minute,
    };
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridContent}>
        <View style={styles.selectDayContainer}>
          <View>
            {/* 8시간 이상일 때만 상하 화살표 표시 */}
            {showHourArrows && (
              <CustomArrowButton
                onPress={handlePreviousHour}
                style={[styles.arrowButtonTop, { transform: [{ rotate: '0deg' }] }]}
              />
            )}
            <View style={styles.timeContainer}>
              {hours.slice(visibleStartHour, visibleStartHour + 32).map((hour, hourIndex) => (
                <View key={hourIndex} style={styles.timeLabel}>
                  {hour.includes('00분') ? (
                    <Text style={styles.timeLabelText}>{hour.replace(' 00분', '')}</Text>
                  ) : (
                    <View style={styles.grayLine} />
                  )}
                </View>
              ))}
            </View>
            {/* 8시간 이상일 때만 상하 화살표 표시 */}
            {showHourArrows && (
              <CustomArrowButton
                onPress={handleNextHour}
                style={[styles.arrowButtonBottom, { transform: [{ rotate: '180deg' }] }]}
              />
            )}
          </View>

          <View style={[styles.dayContainer, { marginLeft: showDayArrows ? 23 : 25 }]}>
            {/* 5일 이상일 때만 좌우 화살표 표시 */}
            {showDayArrows && (
              <CustomArrowButton
                onPress={handlePreviousDay}
                style={[styles.arrowSideButtonLeft, { transform: [{ rotate: '-90deg' }] }]}
              />
            )}
            {days.slice(visibleStartDay, visibleStartDay + 5).map((day, dayIndex) => (
              <View key={dayIndex} style={styles.dayColumn}>
                <TouchableOpacity
                  onPress={() => handleDayHeaderPress(dayIndex)} // dayHeader 클릭 시 처리
                  style={[
                    styles.dayHeader,
                    selectedDayIndex === dayIndex && { backgroundColor: colors.buttonAfterColor }
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDayIndex === dayIndex && { color: colors.white }
                    ]}
                  >
                    {day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      selectedDayIndex === dayIndex && { color: colors.white }
                    ]}
                  >
                    {dates[visibleStartDay + dayIndex]}
                  </Text>
                </TouchableOpacity>
                <PanGestureHandler
                  onGestureEvent={(event) => onGestureEvent(visibleStartDay + dayIndex, event)}
                  onHandlerStateChange={(event) => {
                    event.nativeEvent.state === 'END' ? onGestureEnd() : onGestureStart(visibleStartDay + dayIndex, event);
                  }}
                >
                  <View style={styles.blockContainer}>
                    {hours.slice(visibleStartHour, visibleStartHour + 32).map((_, hourIndex) => (
                      <View key={hourIndex} style={[styles.timeBlockContainer, { position: 'relative' }]}>
                        {isStartOfSelection(dayIndex, hourIndex) && (
                          <TimeDragBar style={{ transform: [{ rotate: '0deg' }] }} />
                        )}
                        <View
                          style={[
                            styles.timeBlock,
                            selectedTimes[`${dayIndex}-${hourIndex + visibleStartHour}`] && styles.selectedBlock,
                          ]}
                        />
                        {isEndOfSelection(dayIndex, hourIndex) && (
                          <TimeDragBar style={{ transform: [{ rotate: '180deg' }], top: 3 }} />
                        )}
                      </View>
                    ))}
                  </View>
                </PanGestureHandler>
              </View>
            ))}
            {/* 5일 이상일 때만 좌우 화살표 표시 */}
            {showDayArrows && (
              <CustomArrowButton
                onPress={handleNextDay}
                style={[styles.arrowSideButtonRight, { transform: [{ rotate: '90deg' }] }]}
              />
            )}
          </View>
        </View>
      </View>
      {/* 모달 컴포넌트 */}
      {isModalVisible && (
        <TimeSelectionModal
          visible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
          selectedDate={selectedDate}
          onApplyTimeSelection={onApplyTimeSelection}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
  },
  gridContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer:{
    height: 384,  // 8시간 기준 높이
    width: 42,
    marginTop: 0,
    position: 'absolute',
    top: 85,
    left: 30,
  },
  timeLabel: {
    height: 12,  // 15분 단위
    justifyContent: 'center',
  },
  timeLabelText: {
    fontSize: 11,
    textAlign: 'right',
    color: colors.fontGray,
    width: 42,
  },
  grayLine: {
    height: 1,
    width: 8,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
    marginVertical: 14,
    alignSelf: 'flex-end',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 70,
  },
  dayColumn: {
    marginHorizontal: 5,
  },
  dayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 41,
    height: 64,
    borderRadius: 100,
  },
  dayText: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: colors.fontGray,
  },
  dateText: {
    color: colors.fontGray,
    fontSize: 8,
    fontWeight: '600',
  },
  timeBlock: {
    height: 12, // 15분 단위의 블록
    width: 41,
    backgroundColor: colors.ButtonDisableGray,
    marginBottom: 0, 
  },
  selectedBlock: {
    backgroundColor: colors.calendarColor,
  },
  arrowButtonTop: {
    position: 'absolute',
    top: 65, 
    left: 30, 
  },
  arrowButtonBottom: {
    position: 'absolute',
    top: 475, 
    left: 30,
  },
  arrowSideButtonLeft: {
    position: 'absolute',
    top: 25,  
    left: -25, 
    zIndex: 1,
  },
  arrowSideButtonRight: {
    position: 'absolute',
    top: 25, 
    right: -25,
    zIndex: 1,
  },
});

export default TimeSelectionGrid;
