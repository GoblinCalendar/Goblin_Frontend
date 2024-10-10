import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import ButtonComponent from '../components/Button';
import colors from '../styles/colors';
import TimePicker from './TimePicker';
import { router, useRouter } from 'expo-router';

const CandidateListConfirmModal = ({ visible, toggleModal, selectedSchedule, expectedDuration }) => {
    const router = useRouter();
    const [startTime, setStartTime] = useState("오전 12 : 00");  // 시작 시간 상태 관리
    const [endTime, setEndTime] = useState("오전 12 : 00");      // 종료 시간 상태 관리

    const handleApply = () => {
        toggleModal();  // 모달을 닫고
        setTimeout(() => {
          router.push('/monthly');
        }, 300); 
    };

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={800}
      animationOutTiming={800}
      style={styles.modal}
    >
      <View style={styles.container}>
          <View style={styles.modalStart}></View>
          
          <Text style={styles.titleText}>일정 후보 리스트</Text>
          <Text style={styles.subTitleText}>예상 일정 소요 시간 : {expectedDuration}</Text>

          <TimePicker 
            startTime={startTime} 
            endTime={endTime} 
            setStartTime={setStartTime} 
            setEndTime={setEndTime} 
            />


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
      },
      container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        height: 442,
        width: Dimensions.get('window').width,
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
        marginTop: 25,
        height: 28,
        fontWeight: '800',
        fontSize: 20,
        color: colors.black,
        marginLeft: 36,
        alignItems: 'center',
      },
      subTitleText: {
        marginTop: 4,
        height: 20,
        fontSize: 14,
        color: colors.fontGray,
        marginLeft: 36,
        alignItems: 'center',
      },
      
      
      applyButton: {
        marginBottom: 15,
        alignSelf: 'center',
      },
});

export default CandidateListConfirmModal;
