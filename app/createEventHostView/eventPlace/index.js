import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import BackButton from '../../../components/BackButton';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';

const buttonWidth = 335; // 버튼의 고정 너비

const EventPlaceScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산 

    const handleNextPress = () => {
        if (selectedFriends.length > 0) {
            router.push('/createEventHostView/eventComplete');
        }
    };

    return (
        <View style={[styles.container, { width }]}>
        {/* BackButton 컴포넌트 */}
        <BackButton navigateTo='/createEventHostView/eventPeople'/>

        {/* 타이틀 문구 */}
        <Text style={styles.titleText}>
            일정을 진행할{"\n"}
            장소를 입력해 보세요
        </Text>

        <Text style={styles.subTitleText}>(선택 사항)</Text>

        <View>
            <Text>대면 장소</Text>
            {/* InputBox 컴포넌트 */}
            <InputBox 
                style={[styles.inputBox, { left: horizontalPadding }]} 
                onChangeText={setInputValue} 
                placeholder="대면 장소 이름을 작성해주세요!"
            />
        </View>

        <View>
            <Text>비대면 링크 주소</Text>
            {/* InputBox 컴포넌트 */}
            <InputBox 
                style={[styles.inputBox, { left: horizontalPadding }]} 
                onChangeText={setInputValue} 
                placeholder="비대면 링크를 작성해 주세요!"
            />
        </View>

        {/* 다음 버튼 */}
        <ButtonComponent
            title="일정 생성하기"
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

export default EventPlaceScreen;
