import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, PanResponder } from 'react-native';

const hours = Array.from({ length: 24 }, (_, i) => `${i < 12 ? '오전' : '오후'} ${i % 12 === 0 ? 12 : i % 12}시`);
const days = ['화', '수', '목', '금', '일'];
const dates = ['9.10', '9.11', '9.12', '9.13', '9.15'];

const TimeSelectionGrid = () => {
  const [selectedTimes, setSelectedTimes] = useState({});
  const timeScrollRef = useRef(null);  // 시간 스크롤뷰 참조
  const gridScrollRefs = useRef([]);   // 요일별 스크롤뷰 참조
  const isDraggingRef = useRef(false); // 드래그 여부 추적

  const handleTouch = (dayIndex, startHourIndex, endHourIndex) => {
    setSelectedTimes((prev) => {
      const updated = { ...prev };
      for (let i = startHourIndex; i <= endHourIndex; i++) {
        const key = `${dayIndex}-${i}`;
        updated[key] = !prev[key]; // 선택/해제 기능
      }
      return updated;
    });
  };

  const createPanResponder = (dayIndex) => {
    let startHourIndex = null;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        isDraggingRef.current = true; // 드래그 시작
        const { y0 } = gestureState;
        startHourIndex = Math.floor(y0 / 50);
        handleTouch(dayIndex, startHourIndex, startHourIndex);
      },
      onPanResponderMove: (e, gestureState) => {
        if (!isDraggingRef.current) return;
        const { moveY } = gestureState;
        const endHourIndex = Math.floor(moveY / 50);
        if (startHourIndex !== null) {
          handleTouch(dayIndex, Math.min(startHourIndex, endHourIndex), Math.max(startHourIndex, endHourIndex));
        }
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false; // 드래그 종료
      },
    });
  };

  const syncScroll = (event) => {
    if (isDraggingRef.current) return; // 드래그 중일 때는 스크롤 비활성화

    const offsetY = event.nativeEvent.contentOffset.y;
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollTo({ y: offsetY, animated: false });
    }
    gridScrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.scrollTo({ y: offsetY, animated: false });
      }
    });
  };

  return (
    <ScrollView horizontal>
      <View style={styles.timeContainer}>
        <ScrollView ref={timeScrollRef} onScroll={syncScroll} scrollEventThrottle={16}>
          {hours.map((hour, index) => (
            <View key={index} style={styles.timeLabel}>
              <Text>{hour}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {days.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.dayColumn}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.dateText}>{dates[dayIndex]}</Text>
          </View>

          <View style={styles.grid}>
            <ScrollView
              ref={(ref) => (gridScrollRefs.current[dayIndex] = ref)}
              scrollEnabled={!isDraggingRef.current} // 드래그 중일 때는 스크롤 비활성화
              onScroll={syncScroll}
              scrollEventThrottle={16}
              {...createPanResponder(dayIndex).panHandlers}
            >
              {hours.map((_, hourIndex) => (
                <View
                  key={hourIndex}
                  style={[
                    styles.timeBlock,
                    selectedTimes[`${dayIndex}-${hourIndex}`] && styles.selectedBlock,
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    width: 80,
  },
  timeLabel: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayColumn: {
    width: 60,
    marginHorizontal: 5,
  },
  dayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontWeight: 'bold',
  },
  dateText: {
    color: 'gray',
  },
  grid: {
    flexDirection: 'column',
  },
  timeBlock: {
    height: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
    borderRadius: 4,
  },
  selectedBlock: {
    backgroundColor: '#82B1FF',
  },
});

export default TimeSelectionGrid;
