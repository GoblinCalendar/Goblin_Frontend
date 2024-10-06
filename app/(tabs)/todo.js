import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import Check from '../../assets/check.svg'
import CirclePlus from '../../assets/circle_plus.svg'

const mockData = [
  { date: '11', day: '금요일', month: '9월', tasks: [
      { id: '1', title: '신제품 마케팅 회의 관련 메일 발송', dDay: 'D-Day' },
      { id: '2', title: '신년 이벤트 페이지 디자인 수정', dDay: 'D-1' },
      { id: '3', title: '신제품 상세 페이지 제작', dDay: 'D-2' },
      { id: '4', title: '성북구뭉게톤성북구성북뭉게구름', dDay: 'D-3' },
    ]
  },
  { date: '12', day: '토요일', month: '9월', tasks: [
      { id: '5', title: '신년 이벤트 페이지 디자인 수정', dDay: 'D-Day' },
      { id: '6', title: '신제품 상세 페이지 제작', dDay: 'D-1' },
    ]
  },
  { date: '13', day: '일요일', month: '9월', tasks: [
      { id: '7', title: '신제품 상세 페이지 제작', dDay: 'D-Day' },
    ]
  },
  { date: '16', day: '수요일', month: '9월', tasks: [
      { id: '8', title: '성북구뭉게톤성북구성북뭉게구름', dDay: 'D-0' },
      { id: '9', title: '성북구뭉게톤성북구성북뭉게구름', dDay: 'D-1' },
    ]
  },
];

export default function Todo() {
  const [checkedItems, setCheckedItems] = useState([]); // 체크된 항목들을 저장하는 상태

  const toggleCheck = (taskId) => {
    if (checkedItems.includes(taskId)) {
      // 이미 체크된 항목이면 체크 해제
      setCheckedItems(checkedItems.filter((id) => id !== taskId));
    } else {
      // 체크되지 않은 항목이면 체크 추가
      setCheckedItems([...checkedItems, taskId]);
    }
  };

  const getDdayStyle = (dDay, isChecked) => {
    if (isChecked) return styles.dDayGray; 
    switch (dDay) {
      case 'D-Day':
        return styles.dDayRed;
      default:
        return styles.dDayGreen;
    }
  };

  const getDdayTextColor = (isChecked) => {
    return isChecked ? styles.completed : styles.dDayText;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockData.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{day.date}</Text>
              <View style={styles.datContainer}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text style={styles.monthText}>{day.month}</Text>
              </View>
            </View>

            {day.tasks.map((task, taskIndex) => (
              <View key={taskIndex} style={styles.taskContainer}>
                <TouchableOpacity onPress={() => toggleCheck(task.id)}>
                  <View
                    style={[
                      styles.checkContainer,
                      checkedItems.includes(task.id) && { backgroundColor: colors.skyBlue },
                    ]}
                  >
                    <Check width={13} height={13}/>
                  </View>
                </TouchableOpacity>
                <View style={styles.taskTextContainer}>
                  <Text
                    style={[
                      styles.taskText,
                      checkedItems.includes(task.id) && { color: '#999999' },
                    ]}
                  >
                    {task.title}
                  </Text>
                  <View style={[styles.dDay, getDdayStyle(task.dDay, checkedItems.includes(task.id))]}>
                    <Text style={getDdayTextColor(checkedItems.includes(task.id))}>
                      {checkedItems.includes(task.id) ? '완료' : task.dDay}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {/* 날짜 아래에 선 추가 */}
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>

      {/* To Do 추가 버튼 */}
      <TouchableOpacity style={styles.addButton}>
        <CirclePlus width={28} height={28}/>
        <Text style={styles.addButtonText}>To Do 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  dayContainer: {
    marginTop: 20,
    width: 335,
    alignSelf: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    height: 72,
    width: 335,
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.skyBlue,
    marginRight: 10,
  },
  datContainer: {
    alignItems: 'flex-end',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAAAAA',
    marginTop: 7,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5F5F5F',
  },
  taskContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkContainer: {
    height: 20,
    width: 20,
    backgroundColor: '#DFE3E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginRight: 15,
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  taskText: {
    fontSize: 13,
    color: '#484848',
  },
  dDay: {
    height: 20,
    width: 46,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  dDayText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  dDayRed: {
    backgroundColor: '#FB8B8A',
  },
  dDayGreen: {
    backgroundColor: '#5DD6A4',
  },
  dDayGray: {
    backgroundColor: '#DBDBE5',
  },
  completed: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C7C7F',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(241, 241, 245, 0.7)',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: colors.skyBlue,
    width: 127,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 5,
  },
});
