// eventTime/index.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import BackButton from '../../../components/BackButton';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';

const buttonWidth = 335; // 버튼의 고정 너비

const EventPeopleScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
  const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산 

  const handleNextPress = () => {
    if (selectedTime) {
      router.push('/createEventHostView/eventPlace');
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* BackButton 컴포넌트 */}
      <BackButton />

      {/* 타이틀 문구 */}
      <Text style={styles.titleText}>
        일정에 같이 참여할{"\n"}
        구성원을 선택해 주세요
      </Text>

      {/* 구성원 선택 */}
      <TouchableOpacity style={styles.memberButton} onPress={handleToggleCalendar}>
        <View style={styles.frameChild} />
        <Image style={styles.icon} resizeMode="cover" source={require('../../../assets/member.png')} />
        <Text style={[styles.text, isTextCentered ? styles.centeredText : styles.leftAlignedText]}>{selectedText}</Text>
      </TouchableOpacity>

      {/* 다음 버튼 */}
      <ButtonComponent
        title="다음"
        style={[styles.button, { left: horizontalPadding }]}
        isActive={!!selectedTime || isTimePickerVisible} // 선택한 시간이 있으면 활성화
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
  memberButton: {
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
  button: {
    position: 'absolute',
    top: 714, 
  },
});

export default EventPeopleScreen;
