import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';

const buttonWidth = 335; // 버튼의 고정 너비

const EventCompleteScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산 

    const handleNextPress = () => {
        if (selectedFriends.length > 0) {
            router.push('/');
        }
    };

    return (
        <View style={[styles.container, { width }]}>

        {/* 이벤트 이름 문구 */}
        <Text style={styles.titleText}>
            2차 대면회의
        </Text>

        <Text style={styles.subTitleText}>일정 생성 완료</Text>

        {/* 소요 시간 문구 */}
        <Text>2시간 소요 예상</Text>
        
        {/* 참여자 이름 문구 */}
        <Text>김현서</Text>

        {/* 선택 날짜 문구 */}
        <Text>9.17 ~ 18 | 9.21 ~ 22 | 9.26</Text>

        {/* 시작,종료 시간 문구 */}
        <Text>시작 종료</Text>

        {/* 장소 문구 */}
        <Text>-</Text>

        {/* 다음 버튼 */}
        <ButtonComponent
            title="홈으로 가기"
            style={[styles.button, { left: horizontalPadding }]}
            isActive='true'
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
  
  
  button: {
    position: 'absolute',
    top: 714, 
  },
});

export default EventCompleteScreen;
