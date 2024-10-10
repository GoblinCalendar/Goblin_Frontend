import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import SvgCheckMark from '../assets/check.svg';
import colors from '../styles/colors';
import ButtonComponent from '../components/Button';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../lib/api';
import CandidateListConfirmModal from './CandidateListConfirmModal';

const CandidateListModal = ({ visible, toggleModal, groupId, calendarId, meetingDuration}) => {
    const [selectedId, setSelectedId] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null); // 선택된 일정 저장
    const [expectedDuration, setExpectedDuration] = useState(meetingDuration);
    const [scheduleData, setScheduleData] = useState([]); // API에서 받아올 데이터
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // 확정 모달의 상태
    const router = useRouter();

    useEffect(() => {
      const fetchOptimalTime = async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          const response = await apiClient.get(`/api/groups/${groupId}/calendar/${calendarId}/optimal-time`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setScheduleData(response.data);
        } catch (error) {
          console.error('Error fetching optimal time:', error);
        }
      };
  
      if (visible) {
        fetchOptimalTime();
      }
    }, [visible, groupId, calendarId]);

    const handleSelect = (id) => {
        setSelectedId(id);  // 하나의 아이템만 선택할 수 있도록 설정
        const selected = scheduleData.find((item) => item.id === id); // 선택된 일정 찾기
        setSelectedSchedule(selected); // 선택된 일정 저장
    };

    const handleApply = () => {
        toggleModal();  // 모달을 닫고
        setTimeout(() => {
          setConfirmModalVisible(true); // 선택하기 버튼 누르면 확정 모달을 띄움
        }, 300); 
    };

    const renderItem = ({ item }) => {
        const maxParticipantsToShow = 5;
        const extraParticipants = item.participants.length - maxParticipantsToShow;

        return (
            <TouchableOpacity
                style={[styles.scheduleItem, selectedId === item.id && styles.selectedItem]}
                onPress={() => handleSelect(item.id)}
            >
                <View style={styles.checkBoxContainer}>
                    <View
                        style={[
                            styles.checkBox,
                            { backgroundColor: selectedId === item.id ? colors.buttonAfterColor : colors.checkBoxGray },
                        ]}
                    >
                        <SvgCheckMark width={16} height={16} />
                    </View>
                </View>
                <View style={styles.oneBlock}>
                    <View style={styles.scheduleInfo}>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <Text style={styles.devide}>ㅣ</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <View style={styles.participantContainer}>
                        {item.participants.slice(0, maxParticipantsToShow).map((participant, index) => (
                            <View key={index} style={styles.participant}>
                                <Text style={styles.participantText}>{participant}</Text>
                            </View>
                        ))}
                        {extraParticipants > 0 && (
                            <Text style={styles.extraParticipants}>+{extraParticipants}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

  return (
    <View>
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

          {/* 리스트 */}
          <FlatList
            data={scheduleData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
          />

          {/* 선택하기 버튼 */}
          <ButtonComponent
            title="선택하기"
            style={styles.applyButton}
            // isActive={selectedId !== null}
            isActive={true}
            onPress={handleApply}
          />
        </View>
      </Modal>

      {/* CandidateListConfirmModal을 모달로 추가 */}
      <CandidateListConfirmModal
        visible={isConfirmModalVisible}
        toggleModal={() => setConfirmModalVisible(false)}
        selectedSchedule={selectedSchedule} // 선택된 일정 전달
        expectedDuration={expectedDuration}
      />
    </View>

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
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 36,
    width: 350,
    height: 40,
  },
  selectedItem: {
    backgroundColor: colors.lightBlue,
  },
  checkBoxContainer: {
    marginRight: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.buttonAfterColor,
  },
  oneBlock: {
    flexDirection: 'column',
  },
  scheduleInfo: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 14,
    color: colors.black,
  },
  timeText: {
    fontSize: 14,
    color: colors.black,
  },
  participantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participant: {
    backgroundColor: colors.coolGrayBlue,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 4,
    marginTop: 3,
    height: 17
    },
  participantText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '600',
  },
  devide: {
    color: colors.calendarColor, 
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 2
  },
  extraParticipants: {
    color: colors.coolGrayBlue,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  applyButton: {
    marginBottom: 15,
    alignSelf: 'center',
  },
});

export default CandidateListModal;
