import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import InputBox from '../../../components/InputBox';
import ButtonComponent from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';
import { EventContext } from '../../../context/EventContext';

const buttonWidth = 335; // 버튼의 고정 너비

const EventNameScreen = () => {
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산
    const { setEventDetails } = useContext(EventContext);

    const handleNextPress = () => {
        if (inputValue) {
            setEventDetails((prevDetails) => ({
                ...prevDetails,
                name: inputValue
            }));
            router.push('/createEventHostView/eventTime');
        }
    };

    return(
        <View style={[styles.container, { width }]}>
            {/* BackButton 컴포넌트 */}
            <BackButton navigateTo='/monthly'/>

            {/* 타이틀 문구 */}
            <Text style={styles.titleText}>
                일정 이름을{"\n"}
                어떻게 부를까요?
            </Text>

            {/* InputBox 컴포넌트 */}
            <InputBox 
                style={[styles.inputBox]} 
                onChangeText={setInputValue} 
                placeholder="일정 이름을 작성해 주세요!"
                maxLength={20}
            />

            {/* 글자 수 표시 (입력 중일 때만 표시) */}
            {inputValue.length > 0 && (
                <Text style={styles.charCount}>
                    {inputValue.length > 20 ? '20+' : `${inputValue.length}/20`}
                </Text>
            )}

            {/* ButtonComponent */}
            <ButtonComponent 
                title="다음" 
                style={[styles.button, { left: horizontalPadding }]} 
                isActive={inputValue.length > 0 && inputValue.length <= 20}
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
        fontWeight: '500',
        lineHeight: 34,
        color: colors.black,
        textAlign: 'left',
    },
    inputBox: {
        position: 'absolute',
        top: 232,
        left: 24,
        zIndex: 10,
    },
    charCount: {
        position: 'absolute',
        top: 232,
        left: 328,
        color: colors.font04Gray,
        fontSize: 13,
    },
    button: {
        position: 'absolute',
        bottom: 46, 
        zIndex: 10,
    },
});

export default EventNameScreen;
