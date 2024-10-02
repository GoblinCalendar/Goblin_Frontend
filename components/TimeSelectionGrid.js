// TimeSelectionGrid.js
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import colors from '../styles/colors';
import CustomArrowButton from './ArrowButton';
import TimeDragBar from './TimeDragBar';
import TimeSelectionModal from './TimeSelectionModal';

// 시간 배열 (임시 데이터, 백엔드에서 가져올 데이터를 위해 가변적)
const hours = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const period = hour < 12 ? '오전' : '오후';
    return `${period} ${hour % 12 === 0 ? 12 : hour % 12}시 ${minute === 0 ? '00' : minute}분`;
});

// 임시 시간 배열 (오전 11시부터 오후 4시까지)
// const hours = [];
// for (let i = 44; i <= 64; i++) {  // 11시부터 16시(오후 4시)까지
//   const hour = Math.floor(i / 4);
//   const minute = (i % 4) * 15;
//   const period = hour < 12 ? '오전' : '오후';
//   const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//   const formattedMinute = minute === 0 ? '00' : minute;
//   hours.push(`${period} ${formattedHour}시 ${formattedMinute}분`);
// }

// const days = ['화', '수', '목', '금', '일', '월', '화'];
// const dates = ['9.10', '9.11', '9.12', '9.13', '9.15', '9.16', '9.17'];

const days = ['화', '수', '목', '금', '일'];
const dates = ['9.10', '9.11', '9.12', '9.13', '9.15'];

const TimeSelectionGrid = forwardRef((props, ref) => {
    const [visibleStartHour, setVisibleStartHour] = useState(0);
    const [selectedTimes, setSelectedTimes] = useState({});
    const [visibleStartDay, setVisibleStartDay] = useState(0); 
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [lastSelectedBlock, setLastSelectedBlock] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    // 초기화 함수
    const resetSelection = () => {
        setSelectedTimes({});
    };

    // ref를 통해 상위 컴포넌트에서 초기화 함수를 호출할 수 있도록 함
    useImperativeHandle(ref, () => ({
        resetSelection,
    }));

    // 시간 범위가 8시간을 넘으면 arrowButton 표시
    const showHourArrows = hours.length > 32;
    // 날짜 범위가 5일을 넘으면 arrowSideButton 표시
    const showDayArrows = days.length > 5;

    const handleTouch = (dayIndex, hourIndex, isDragging = false) => {
        setSelectedTimes((prev) => {
            const key = `${dayIndex}-${hourIndex}`;
            if (isDragging) {
                return { ...prev, [key]: true }; // 드래그 중에는 무조건 선택
            } else {
                return { ...prev, [key]: !prev[key] }; // 드래그 중이 아닐 때는 토글
            }
        });
    };

    const onGestureEvent = (dayIndex, event) => {
        const { y } = event.nativeEvent;
        const blockHeight = 12; // 15분 단위의 높이
        const hourIndex = Math.floor(y / blockHeight);

        const currentBlock = `${dayIndex}-${hourIndex}`;
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
        const currentBlock = `${dayIndex}-${hourIndex}`;
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

        return selectedTimes[`${dayIndex}-${hourIndex}`] && !selectedTimes[`${dayIndex}-${hourIndex - 1}`];
    };

    const isEndOfSelection = (dayIndex, hourIndex) => {
        return selectedTimes[`${dayIndex}-${hourIndex}`] && !selectedTimes[`${dayIndex}-${hourIndex + 1}`];
    };

    const handleDayHeaderPress = (dayIndex) => {
        // 선택된 날짜가 다시 눌리면 원래 상태로 돌아감
        if (selectedDayIndex === dayIndex) {
            setSelectedDayIndex(null); // 선택 해제
            setModalVisible(false); // 모달 닫기
        } else {
            setSelectedDayIndex(dayIndex); // 새로운 선택 상태로 변경

            const selectedDate = `2024.${dates[visibleStartDay + dayIndex]}`; // 고정된 2024년과 선택된 날짜 조합
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

            setSelectedDate({
                date: selectedDate,
                dayOfWeek: dayOfWeek,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
            });
            setModalVisible(true); // 모달 열기
        }
    };

    // TODO 칸 칠해지는거 수정해야함 마지막이 이상하게 된다, 오전 12시도 인식 이상하게 된다
    const onApplyTimeSelection = (startTime, endTime) => {
        // 시간을 '오전/오후' 구분과 숫자로 변환하여 비교
        const parseTime = (timeStr) => {
            const [period, time] = timeStr.split(' ');
            let [hour, minute] = time.includes(':') ? time.split(':') : [time, '00']; // ':'가 없으면 분은 00으로 설정
    
            // hour와 minute 값이 정상인지 확인하고 공백 제거
            hour = hour ? parseInt(hour.trim(), 10) : 0;
            minute = minute ? parseInt(minute.trim(), 10) : 0;
    
            // 12시는 특별히 처리 (오전 12시는 0시, 오후 12시는 12시)
            if (period === '오전' && hour === 12) hour = 0;
            if (period === '오후' && hour !== 12) hour += 12;
    
            return hour * 60 + minute; // 분 단위로 변환하여 반환
        };
    
        const startMinutes = parseTime(startTime);
        const endMinutes = parseTime(endTime);
        console.log("변환된 Start Time:", startMinutes);  // 시작 시간 로그
        console.log("변환된 End Time:", endMinutes);      // 종료 시간 로그
    
        const newSelectedTimes = { ...selectedTimes };
    
        // 선택한 날짜의 시간 범위에 맞춰 블록을 선택
        for (let i = 0; i < hours.length; i++) {
            const [period, time] = hours[i].split(' ');
            let [hour, minute] = time.replace('시', '').replace('분', '').split(' ');
    
            // hour와 minute 값이 정상인지 확인하고 공백 제거
            hour = hour ? parseInt(hour.trim(), 10) : 0;
            minute = minute ? parseInt(minute.trim() || '00', 10) : 0;
    
            let totalMinutes = hour * 60 + minute;
            if (period === '오후' && hour !== 12) {
                totalMinutes += 12 * 60; // 오후일 경우 12시간을 더해줌
            }
    
            // 15분 단위로 종료 시간을 설정하고 정확한 범위를 설정
            if (totalMinutes >= startMinutes && totalMinutes < endMinutes) {
                newSelectedTimes[`${selectedDayIndex}-${i}`] = true;
            }
        }
    
        setSelectedTimes(newSelectedTimes);
    };        
    

    // 모달 토글 함수
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        // 모달이 닫힐 때 dayHeader 색상 원상태로 복구
        if (isModalVisible) {
            setSelectedDayIndex(null);
        }
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
                toggleModal={toggleModal}
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
    left: 35, 
},
arrowButtonBottom: {
    position: 'absolute',
    top: 475, 
    left: 35,
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
  