// TimeSelectionGrid.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import colors from '../styles/colors';

// 시간 배열 (00분 포함)
const hours = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const period = hour < 12 ? '오전' : '오후';
  return `${period} ${hour % 12 === 0 ? 12 : hour % 12}시 ${minute === 0 ? '00' : minute}분`;
});

const days = ['화', '수', '목', '금', '일', '월', '화'];
const dates = ['9.10', '9.11', '9.12', '9.13', '9.15', '9.16'];

const TimeSelectionGrid = () => {
    const [visibleStartHour, setVisibleStartHour] = useState(0);
    const [selectedTimes, setSelectedTimes] = useState({});
    const [visibleStartDay, setVisibleStartDay] = useState(0); 
    const [dragging, setDragging] = useState(false);
    const [lastSelectedBlock, setLastSelectedBlock] = useState(null);

    const handleTouch = (dayIndex, hourIndex) => {
        setSelectedTimes((prev) => {
        const key = `${dayIndex}-${hourIndex}`;
        return { ...prev, [key]: !prev[key] };
        });
    };

    const onGestureEvent = (dayIndex, event) => {
        const { y } = event.nativeEvent;
        const blockHeight = 15; // 15분 단위의 높이
        const hourIndex = Math.floor(y / blockHeight);

        const currentBlock = `${dayIndex}-${hourIndex}`;
        if (currentBlock !== lastSelectedBlock) {
        handleTouch(dayIndex, hourIndex + visibleStartHour);
        setLastSelectedBlock(currentBlock);
        }
    };

    const onGestureStart = (dayIndex, event) => {
        const { y } = event.nativeEvent;
        const blockHeight = 15;
        const hourIndex = Math.floor(y / blockHeight);

        const currentBlock = `${dayIndex}-${hourIndex}`;
        handleTouch(dayIndex, hourIndex + visibleStartHour);
        setLastSelectedBlock(currentBlock);
    };

    const handleNextHour = () => {
        if (visibleStartHour < hours.length - 32) {
        setVisibleStartHour(visibleStartHour + 1);
        }
    };

    const handlePreviousHour = () => {
        if (visibleStartHour > 0) {
        setVisibleStartHour(visibleStartHour - 1);
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

    return (
        <View style={styles.gridContainer}>
            <View style={styles.gridContent}>
                <View style={styles.selectDayContainer}>
                <View>
                    <TouchableOpacity onPress={handlePreviousHour} style={styles.arrowButton}>
                    <Text>▲</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={handleNextHour} style={styles.arrowButton}>
                    <Text>▼</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dayContainer}>
                    <TouchableOpacity onPress={handlePreviousDay} style={[styles.arrowSideButton, styles.arrowLeft]}>
                        <Text>{"<"}</Text>
                    </TouchableOpacity>
                    {days.slice(visibleStartDay, visibleStartDay + 5).map((day, dayIndex) => (
                    <View key={dayIndex} style={styles.dayColumn}>
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayText}>{day}</Text>
                            <Text style={styles.dateText}>{dates[visibleStartDay + dayIndex]}</Text>
                        </View>
                        <PanGestureHandler
                        onGestureEvent={(event) => onGestureEvent(visibleStartDay + dayIndex, event)}
                        onHandlerStateChange={(event) => onGestureStart(visibleStartDay + dayIndex, event)}
                        >
                        <View>
                            {hours.slice(visibleStartHour, visibleStartHour + 32).map((_, hourIndex) => (
                            <View
                                key={hourIndex}
                                style={[
                                styles.timeBlock,
                                selectedTimes[`${visibleStartDay + dayIndex}-${hourIndex + visibleStartHour}`] && styles.selectedBlock,
                                ]}
                            />
                            ))}
                        </View>
                        </PanGestureHandler>
                    </View>
                    ))}
                    <TouchableOpacity onPress={handleNextDay} style={[styles.arrowSideButton, styles.arrowRight]}>
                    <Text>{">"}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </View>
    );
};
  
const styles = StyleSheet.create({
gridContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
},
gridContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
},
selectDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
},
timeContainer:{
    height: 480,  // 8시간 기준 높이
    width: 42,
},
timeLabel: {
    height: 15,  // 15분 단위
    justifyContent: 'center',
    paddingLeft: 10,
},
timeLabelText: {
    fontSize: 11,
    textAlign: 'right',
    color: colors.fontGray,
    width: 40,
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
    marginLeft: 10,
    justifyContent: 'center',
},
dayColumn: {
    marginHorizontal: 5,
},
dayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 41,
    height: 64,
    backgroundColor:colors.buttonAfterColor,
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
    height: 15, // 15분 단위의 블록
    width: 41,
    backgroundColor: colors.lightGray,
    marginBottom: 0, // 이어진 느낌을 주기 위해 블록 사이 간격 제거
},
selectedBlock: {
    backgroundColor: colors.calendarColor,
},
arrowButton: {
    padding: 2,
    backgroundColor: '#ddd',
    borderRadius: 5,
},
arrowSideButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    position: 'absolute',
    top: -15,
    zIndex: 1,
},
arrowLeft: {
    left: 0,
},
arrowRight: {
    right: 0,
},
});
  
export default TimeSelectionGrid;
  