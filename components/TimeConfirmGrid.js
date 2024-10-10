import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import CustomArrowButton from './ArrowButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../lib/api';

// 시간 배열 생성 함수
const createHoursArray = (start, end) => {
    const hours = [];
    const startHour = new Date(start).getHours();
    const startMinute = new Date(start).getMinutes();
    const endHour = new Date(end).getHours();
    const endMinute = new Date(end).getMinutes();

    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 15) {
        if (h === startHour && m < startMinute) continue;
        if (h === endHour && m > endMinute) break;
        const period = h < 12 ? '오전' : '오후';
        const formattedHour = h % 12 === 0 ? 12 : h % 12;
        const formattedMinute = m === 0 ? '00' : m;
        hours.push(`${period} ${formattedHour}시 ${formattedMinute}분`);
        }
    }
    return hours;
};

// 시작 시간에 맞춰 첫 번째 칸을 계산하는 함수
const calculateTimeBlock = (baseStartTime, startHour, startMinute) => {
    const baseHour = new Date(baseStartTime).getHours();
    const baseMinute = new Date(baseStartTime).getMinutes();
    const baseBlock = baseHour * 4 + Math.floor(baseMinute / 15); // 기준 시간의 첫 블록 계산

    const currentBlock = startHour * 4 + Math.floor(startMinute / 15); // 현재 블록 계산
    return currentBlock - baseBlock; // 기준 시간과의 차이로 첫 블록 계산
};

const TimeConfirmGrid = forwardRef(({ groupId, calendarId }, ref) => {
  const [visibleStartHour, setVisibleStartHour] = useState(0);
  const [visibleStartDay, setVisibleStartDay] = useState(0);
  const [hours, setHours] = useState([]);
  const [dates, setDates] = useState([]);
  const [days, setDays] = useState([]); // 동적으로 날짜 이름 설정
  const [timeData, setTimeData] = useState({}); // 서버에서 불러온 시간 데이터를 저장할 상태
  const [baseStartTime, setBaseStartTime] = useState(null); // 기준 시작 시간 저장

  // 첫 번째 API 호출: 그리드 시간 범위 및 날짜 설정
  useEffect(() => {
    const fetchTimeRange = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { selectedDateTimes } = response.data;

            // 날짜 배열 생성 (시작 시간과 종료 시간 사이의 날짜들)
            const generatedDates = selectedDateTimes.map(item => {
                const startDate = new Date(item.startDateTime);
                return `${startDate.getMonth() + 1}.${startDate.getDate()}`;
            });

            const generatedDays = selectedDateTimes.map(item => {
                const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                const startDate = new Date(item.startDateTime);
                return dayNames[startDate.getDay()];
            });

            if (selectedDateTimes.length > 0) {
                // 첫 번째 날짜의 시간만 사용
                const firstDateTime = selectedDateTimes[0];
                
                // 기준 시작 시간을 설정
                setBaseStartTime(firstDateTime.startDateTime);

                // 시작과 종료 시간을 로컬 한국 시간으로 변환
                const startTime = new Date(firstDateTime.startDateTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                const endTime = new Date(firstDateTime.endDateTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

                // 첫 번째 날짜의 시간 범위 생성
                const generatedHours = createHoursArray(firstDateTime.startDateTime, firstDateTime.endDateTime);
                setHours(generatedHours); // 첫 번째 날짜의 시간을 배열로 설정

            }

            setDates(generatedDates);
            setDays(generatedDays);

            } catch (error) {
                // 에러 메시지와 함께 에러의 다른 부분도 출력
                console.error('Error fetching time range:', error.message);
                console.error('Error details:', {
                    message: error.message,
                    config: error.config,
                    code: error.code,
                    status: error.response ? error.response.status : 'No response',
                    data: error.response ? error.response.data : 'No data',
                });
            }
        };

    fetchTimeRange();
    }, [groupId, calendarId]);

  // 두 번째 API 호출: 그리드 색칠하기
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}/available-times`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const availableTimes = response.data;
        console.log("availableTimes: ", availableTimes);

        // 시간 데이터를 설정 (participants에 있는 유저 수에 따라 다르게 스타일링)
        const timeSlotData = availableTimes.reduce((acc, slot) => {
          const dateKey = new Date(slot.startTime).toISOString().split('T')[0];
          
          const startHour = new Date(slot.startTime).getHours();
          const startMinute = new Date(slot.startTime).getMinutes();
          const startBlock = calculateTimeBlock(baseStartTime, startHour, startMinute); // 기준 시작 시간을 기준으로 첫 블록 계산

          const endHour = new Date(slot.endTime).getHours();
          const endMinute = new Date(slot.endTime).getMinutes();
          const endBlock = calculateTimeBlock(baseStartTime, endHour, endMinute); // 종료 시간도 기준 시간에 맞게 블록 계산

          acc[dateKey] = acc[dateKey] || {};
          for (let i = startBlock; i <= endBlock; i++) {
            acc[dateKey][i] = slot.participants.length;
          }
          return acc;
        }, {});

        console.log("timeSlotData: ", timeSlotData);
        setTimeData(timeSlotData);

      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };

    if (baseStartTime) {
      fetchAvailableTimes();
    }
  }, [groupId, calendarId, baseStartTime]);

  // 각 시간 블록의 배경색을 결정하는 함수 (참가자 수에 따라)
  const getBlockStyle = (dayIndex, hourIndex) => {
    const selectedDate = dates[visibleStartDay + dayIndex];
    
    // 날짜가 존재하지 않으면 기본 스타일 반환
    if (!selectedDate) {
      return styles.defaultColor;
    }
  
    // selectedDate의 형식을 "YYYY-MM-DD"로 변경
    const date = new Date(`2024-${selectedDate.split('.')[0]}-${selectedDate.split('.')[1]}`).toISOString().split('T')[0];
  
    const blockData = timeData[date] || {}; // 해당 날짜의 데이터 가져오기
    const blockKey = visibleStartHour + hourIndex; // 시간 블록 키
  
    const participants = blockData[blockKey] || 0; // 해당 시간의 참가자 수 가져오기
  
    // 참가자 수에 따라 스타일 반환
    if (participants === 0) {
      return styles.participationNone;
    } else if (participants === 1) {
      return styles.participation1;
    } else if (participants === 2) {
      return styles.participation2;
    } else if (participants === 3) {
      return styles.participation3;
    } else if (participants >= 4) { // 4명 이상일 경우
      return styles.participation4;
    } else {
      return styles.defaultColor;
    }
  };

  // 시간 범위가 8시간을 넘으면 arrowButton 표시
  const showHourArrows = hours.length > 32;
  // 날짜 범위가 5일을 넘으면 arrowSideButton 표시
  const showDayArrows = days.length > 5;

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
    if (visibleStartDay < days.length - 5) {
      setVisibleStartDay(visibleStartDay + 1);
    }
  };

  const handlePreviousDay = () => {
    if (visibleStartDay > 0) {
      setVisibleStartDay(visibleStartDay - 1);
    }
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridContent}>
        <View style={styles.selectedDayContainer}>
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
                <TouchableOpacity style={styles.dayHeader}>
                  <Text style={styles.dayText}>{day}</Text>
                  <Text style={styles.dateText}>{dates[visibleStartDay + dayIndex]}</Text>
                </TouchableOpacity>
                <View style={styles.blockContainer}>
                  {hours.slice(visibleStartHour, visibleStartHour + 32).map((_, hourIndex) => (
                    <View key={hourIndex} style={[styles.timeBlockContainer]}>
                      <View
                        style={[
                          styles.timeBlock,
                          getBlockStyle(dayIndex, hourIndex)
                        ]}
                      />
                    </View>
                  ))}
                </View>
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
  selectedDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
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
    marginBottom: 0, 
  },
  participationNone: {
    backgroundColor: colors.ButtonDisableGray,
  },
  participation1: {
    backgroundColor: colors.participation1,
  },
  participation2: {
    backgroundColor: colors.participation2,
  },
  participation3: {
    backgroundColor: colors.participation3,
  },
  participation4: {
    backgroundColor: colors.participation4,
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

export default TimeConfirmGrid;
