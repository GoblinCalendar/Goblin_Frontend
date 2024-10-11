import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import ButtonComponent from '../components/Button';
import colors from '../styles/colors';
import TimePicker from './TimePicker';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../lib/api';

// AM/PM과 시간을 변환하는 함수
const convertTo12HourFormat = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHour = hours % 12 || 12;  // 12시간제로 변환 (0시는 12시로 표시)
    return {
        ampm,
        hour: adjustedHour,
        minute: minutes
    };
};

// "오후 3 : 00" 같은 형식을 Date 객체로 변환하는 함수
const parseTime = (timeString) => {
    // "오후 3 : 15" -> ["오후", "3", "15"]
    const [ampm, hourPart, minutePart] = timeString.split(/[:\s]+/);  // 공백과 ":"를 기준으로 분리

    const hour = Number(hourPart.trim());
    const minute = Number(minutePart.trim());

    // ampm에 따라 24시간제 시간을 처리
    let parsedHour = hour;
    if (ampm === '오후' && hour !== 12) {
        parsedHour += 12; // 오후이면 12시간 더함 (12시는 그대로 둠)
    } else if (ampm === '오전' && hour === 12) {
        parsedHour = 0; // 오전 12시는 0시로 변환
    }

    return {
        ampm: ampm === '오후' ? 'PM' : 'AM',  // 'AM'과 'PM'으로 변환
        hour: parsedHour,  // 24시간제 시간
        minute: minute || 0  // 분 (없으면 0)
    };
};

const CandidateListConfirmModal = ({ visible, toggleModal, selectedSchedule, expectedDuration,groupId, calendarId }) => {
    const router = useRouter();
    const [startTime, setStartTime] = useState('-');  // 시작 시간 상태 관리
    const [endTime, setEndTime] = useState('-');      // 종료 시간 상태 관리
    const [formattedDate, setFormattedDate] = useState('-');  // 포맷된 날짜 상태 관리
    const [formattedTime, setFormattedTime] = useState('-');  // 포맷된 시간 상태 관리

    // 요일 구하는 함수
   const getDayOfWeek = (date) => {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        return dayNames[date.getDay()];
    };

    // 오전/오후 시간 변환 함수
    const formatTimeToKorean = (date) => {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const suffix = hours >= 12 ? '오후' : '오전';
        hours = hours % 12 || 12; // 12시간제로 변환 (0시는 12시로 표시)
        return `${suffix} ${hours}시${minutes !== '00' ? ` ${minutes}분` : ''}`;
    };

    // 날짜 및 시간 포맷터 함수
    const formatDateAndTime = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const formattedDate = `${start.getMonth() + 1}.${start.getDate()} (${getDayOfWeek(start)})`;
        const formattedTime = `${formatTimeToKorean(start)} ~ ${formatTimeToKorean(end)}`;
        return { formattedDate, formattedTime };
    };

    useEffect(() => {
        if (selectedSchedule) {
            const { formattedDate, formattedTime } = formatDateAndTime(selectedSchedule.startTime, selectedSchedule.endTime);
            setFormattedDate(formattedDate);
            setFormattedTime(formattedTime);
        }
    }, [selectedSchedule]);

    const handleApply = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
    
            // 시작 시간과 종료 시간을 올바르게 파싱
            const parsedStartTime = parseTime(startTime);
            const parsedEndTime = parseTime(endTime);
            console.log("Selected start time:", startTime);
            console.log("Selected end time:", endTime);
            console.log("Parsed start time:", parsedStartTime);
            console.log("Parsed end time:", parsedEndTime);
    
            // API에 보낼 요청 본문 구성
            const requestBody = {
                optimalTimeSlotId: selectedSchedule.id,
                date: selectedSchedule.startTime.split('T')[0],  // "YYYY-MM-DD" 형식으로 변환
                startAmPm: parsedStartTime.ampm,
                startHour: parsedStartTime.hour,
                startMinute: parsedStartTime.minute,
                endAmPm: parsedEndTime.ampm,
                endHour: parsedEndTime.hour,
                endMinute: parsedEndTime.minute
            };
    
            // POST 요청 보내기
            const response = await apiClient.post(`/api/groups/${groupId}/calendar/${calendarId}/confirm`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // 요청이 성공하면 모달을 닫고 다른 화면으로 이동
            if (response.status === 200) {
                toggleModal();
                setTimeout(() => {
                  router.push('/monthly');
                }, 300);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error confirming schedule:', error.response.data);  // 서버에서 보낸 에러 메시지
                console.error('Error status:', error.response.status);            // 상태 코드
            } else {
                console.error('Error:', error.message); // 일반적인 에러 메시지
            }
        }
    };

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={200}
      animationOutTiming={200}
      style={styles.modal}
    >
      <View style={styles.container}>
          <View style={styles.modalStart}></View>
          
          <Text style={styles.titleText}>{formattedDate}  {formattedTime}</Text>
          <Text style={styles.subTitleText}>예상 일정 소요 시간 : {expectedDuration}</Text>
        
        <View style={styles.timePickerContainer}>
            <TimePicker 
                startTime={startTime} 
                endTime={endTime} 
                setStartTime={(time) => {
                    console.log("Selected start time:", time);  // 로그로 선택된 시작 시간 확인
                    setStartTime(time);  // 선택된 시작 시간을 설정
                }} 
                setEndTime={(time) => {
                    console.log("Selected end time:", time);  // 로그로 선택된 종료 시간 확인
                    setEndTime(time);  // 선택된 종료 시간을 설정
                }}
            />
        </View>

          {/* 젹용하기 버튼 */}
          <ButtonComponent
            title="젹용하기"
            style={styles.applyButton}
            isActive={true}
            onPress={handleApply}
          />
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
        position: 'relative',
      },
      container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        height: 442,
        width: Dimensions.get('window').width,
        // width: Dimensions.get('window').width - 40,
      },
      modalStart: {
        width: 75,
        height: 4,
        borderRadius: 10,
        backgroundColor: colors.calendarColor,
        alignSelf: 'center',
        marginTop: -6,
      },
      titleText: {
        marginTop: 20,
        height: 28,
        fontWeight: '600',
        color: colors.black,
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
      },
      subTitleText: {
        marginTop: 0,
        height: 20,
        fontSize: 14,
        color: colors.black,
        alignSelf: 'center',
        alignItems: 'center',
      },
      timePickerContainer: {
        marginTop: 10,
        alignSelf: 'center',
      },
      
      applyButton: {
        // marginBottom: 55,
        alignSelf: 'center',
        position: 'absolute',
        top: 362,
      },
});

export default CandidateListConfirmModal;
