import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import SvgSearchIcon from '../assets/reading_glasses.svg'; // 검색 아이콘을 SVG로 불러옴
import colors from '../styles/colors';
import Toast from 'react-native-toast-message';

const InviteMemberModal = ({ isVisible, onClose }) => {
  const [memberId, setMemberId] = useState('');
  const [isFocused, setIsFocused] = useState(false); // 입력 필드가 포커스되었는지 상태 관리
  const [selectedMember, setSelectedMember] = useState(null); // 선택된 멤버 상태 관리

  const handleInvite = () => {
    // 멤버 초대 로직을 여기에 추가
    Toast.show({
      type: 'successToast',
      text1: '멤버 초대가 완료되었습니다!',
      position: 'bottom',
  });
    onClose(); // 초대 버튼을 누르면 모달을 닫음
  };

  const handleMemberIdChange = (text) => {
    setMemberId(text);

    // 입력 완료 시 사용자 정보가 자동으로 표시되도록 조건 추가
    if (text === '김민지') {
      setSelectedMember({
        name: '김민지',
        username: 'abcd1234',
      });
    } else {
      setSelectedMember(null); // 일치하지 않으면 초기화
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} useNativeDriver={true} style={styles.modal}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>

        {/* 모달 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>멤버 초대</Text>
        </View>

        {/* 멤버 ID 입력 */}
        <Text style={styles.label}>멤버 ID</Text>
        <View
          style={[
            styles.inputContainer,
            { borderBottomColor: isFocused ? colors.buttonAfterColor : colors.lightGray }, // 포커스 여부에 따라 색상 변경
          ]}
        >
          <SvgSearchIcon width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="추가할 멤버의 ID를 입력해 주세요"
            placeholderTextColor={colors.font04Gray}
            value={memberId}
            onChangeText={handleMemberIdChange}
            onFocus={() => setIsFocused(true)} // 포커스되었을 때
            onBlur={() => setIsFocused(false)} // 포커스가 벗어났을 때
          />
        </View>

        {/* 선택된 사용자 정보 표시 */}
        {selectedMember && (
          <View style={styles.memberView}>
            <Text style={styles.memberName}>{selectedMember.name}</Text>
            <Text style={styles.devide}>  |  </Text>
            <Text style={styles.memberUsername}>{selectedMember.username}</Text>
          </View>
        )}

        {/* 초대 버튼 */}
        <TouchableOpacity
          style={[styles.inviteButton, { backgroundColor: memberId ? colors.buttonAfterColor : colors.ButtonDisableGray }]}
          onPress={handleInvite}
          disabled={!memberId}
        >
          <Text style={[styles.inviteButtonText, { color: memberId ? colors.white : colors.font04Gray }]}>초대하기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 327,
    height: 358,
    backgroundColor: colors.white,
    borderRadius: 16,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    height: 28,
  },
  closeButton: {
    fontSize: 24,
    color: colors.black,
    position: 'absolute',
    left: 290,
    top: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginTop: 20,
    marginLeft: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    width: 287,
    height: 52,
    marginLeft: 24,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    height: 24,
    fontSize: 14,
    color: colors.black,
  },
  memberView: {
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    marginTop: 20,
    width: 287,
    height: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginLeft: 20,
  },
  devide: {
    color: colors.white,
    fontSize: 14,
  },
  memberUsername: {
    fontSize: 14,
    color: colors.font04Gray,
  },
  inviteButton: {
    height: 48,
    width: 108,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ButtonDisableGray,
    position: 'absolute',
    top: 290,
    alignSelf: 'center',
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.font05Gray,
  },
});

export default InviteMemberModal;
