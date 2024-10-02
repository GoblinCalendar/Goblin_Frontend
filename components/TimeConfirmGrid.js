import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import CustomArrowButton from './ArrowButton';

// 시간 배열
const hours = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const period = hour < 12 ? '오전' : '오후';
    return `${period} ${hour % 12 === 0 ? 12 : hour % 12}시 ${minute === 0 ? '00' : minute}분`;
});

// 날짜 및 시간
const days = ['화', '수', '목', '금', '일'];
const dates = ['9.10', '9.11', '9.12', '9.13', '9.15'];

// 임의로 블록에 색칠할 데이터 설정 (사진과 비슷한 느낌으로)
const mockData = {
    '9.10': { 44: 2, 45: 2, 46: 3, 47: 3, 48: 3, 49: 1, 50: 1 },
    '9.11': { 52: 2, 53: 2, 54: 2 },
    '9.12': { 40: 1, 41: 2, 42: 2, 43: 3, 44: 3, 45: 1 },
    '9.13': { 46: 4, 47: 4, 48: 4, 49: 3, 50: 2, 51: 1 },
    '9.15': { 52: 2, 53: 3, 54: 3, 55: 2 },
};

const TimeConfirmGrid = forwardRef((props, ref) => {
    const [visibleStartHour, setVisibleStartHour] = useState(0);
    const [visibleStartDay, setVisibleStartDay] = useState(0);

    // 각 시간 블록의 배경색을 결정하는 함수 (숫자 비교 방식으로 스타일 이름 지정)
    const getBlockStyle = (dayIndex, hourIndex) => {
        const date = dates[visibleStartDay + dayIndex];
        const blockData = mockData[date] || {};
        const blockKey = (visibleStartHour + Math.floor(hourIndex / 4)) * 4 + (hourIndex % 4);
        const participants = blockData[blockKey] || 0;

        // 숫자에 따라 스타일 이름을 반환
        if (participants === 0) {
            return styles.participationNone;
        } else if (participants === 1) {
            return styles.participation1;
        } else if (participants === 2) {
            return styles.participation2;
        } else if (participants === 3) {
            return styles.participation3;
        } else if (participants === 4) {
            return styles.participation4;
        } else {
            return styles.defaultColor;
        }
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

    return (
        <View style={styles.gridContainer}>
            <View style={styles.gridContent}>
                <View style={styles.selectedDayContainer}>
                    <View>
                        {/* 상하 화살표 */}
                        <CustomArrowButton
                            onPress={handlePreviousHour}
                            style={[styles.arrowButtonTop, { transform: [{ rotate: '0deg' }] }]}
                        />
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
                        <CustomArrowButton
                            onPress={handleNextHour}
                            style={[styles.arrowButtonBottom, { transform: [{ rotate: '180deg' }] }]}
                        />
                    </View>

                    <View style={[styles.dayContainer, { marginLeft: 25 }]}>
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

export default TimeConfirmGrid;
