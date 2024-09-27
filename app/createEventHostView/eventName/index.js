// eventName/index.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import InputBox from '../../../components/InputBox';
import ButtonComponent from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';

const buttonWidth = 335; // 버튼의 고정 너비

const EventNameScreen = () => {
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산

    const handleNextPress = () => {
        if (inputValue) {
            router.push('/createEventHostView/eventTime');
        }
    };

    return(
        <View style={[styles.container, { width }]}>
            {/* BackButton 컴포넌트 */}
            <BackButton navigateTo='/'/>

            {/* 타이틀 문구 */}
            <Text style={styles.titleText}>
                일정 이름을{"\n"}
                어떻게 부를까요?
            </Text>

            {/* InputBox 컴포넌트 */}
            <InputBox 
                style={[styles.inputBox, { left: horizontalPadding }]} 
                onChangeText={setInputValue} 
                placeholder="일정 이름을 작성해 주세요!"
            />

            {/* ButtonComponent */}
            <ButtonComponent 
                title="다음" 
                style={[styles.button, { left: horizontalPadding }]} 
                isActive={!!inputValue} // 입력 여부에 따라 색상 변경
                onPress={handleNextPress}
            />
        </View>
    )
    
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
    inputBox: {
        position: 'absolute',
        top: 282,
        zIndex: 10,
    },
    button: {
        position: 'absolute',
        top: 714, 
        zIndex: 10,
    },
});

export default EventNameScreen;
