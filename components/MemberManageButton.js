import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import SvgCircle from '../assets/memberManageBtnBg.svg'; // 파란색 원 SVG
import SvgCross from '../assets/memberManageBtn.svg'; // 흰색 십자가 SVG
import SvgDelButton from '../assets/delete_member.svg'; // 멤버 삭제 버튼 SVG
import SvgAddButton from '../assets/invite_member.svg'; // 멤버 초대 버튼 SVG
import SvgLinkButton from '../assets/link.svg'; // 링크 보내기 버튼 SVG
import ActiveSvgDelButton from '../assets/delete_member_active.svg'; // 멤버 삭제 버튼 SVG
import ActiveSvgAddButton from '../assets/invite_member_active.svg'; // 멤버 초대 버튼 SVG
import ActiveSvgLinkButton from '../assets/link_active.svg'; // 링크 보내기 버튼 SVG
import colors from '../styles/colors';

const MemberManageButton = ({ setDeleteMode , openInviteModal, openInviteLinkModal }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current; // 회전을 위한 애니메이션 값
  const [isOpen, setIsOpen] = useState(false); // 버튼이 열렸는지 닫혔는지 상태 저장
  const [activeButton, setActiveButton] = useState(null); // 현재 활성화된 버튼 상태

  const toggleButtons = () => {
    setIsOpen(!isOpen); // 버튼 상태를 토글

    // 버튼을 닫을 때 활성화된 버튼 상태를 초기화
    if (isOpen) {
      setActiveButton(null); // 모드 초기화
      setDeleteMode(false);   // 삭제 모드 해제
    }

    Animated.timing(rotateAnim, {
      toValue: isOpen ? 0 : 1, // 열려 있으면 0으로, 닫혀 있으면 1로 애니메이션
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName); // 어떤 버튼이 눌렸는지 저장

    if (buttonName === 'delete') {
        setDeleteMode(true); // 삭제 모드로 전환
    } else if (buttonName === 'invite') {
        openInviteModal(); // 초대 모달 열기
    } else if (buttonName === 'link') {
      openInviteLinkModal();  // 초대 링크 모달 열기
    }
  };

  // 회전 각도를 interpolate로 설정
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.extraButtons}>
          <TouchableOpacity style={styles.extraButton} onPress={() => handleButtonPress('delete')}>
            <View
              style={[
                styles.miniButtons,
                activeButton === 'delete' && { backgroundColor: colors.buttonAfterColor },
              ]}
            >
              {activeButton === 'delete' ? (
                <ActiveSvgDelButton width={20} height={20} />
              ) : (
                <SvgDelButton width={20} height={20} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extraButton} onPress={() => handleButtonPress('invite')}>
            <View
              style={[
                styles.miniButtons,
                activeButton === 'invite' && { backgroundColor: colors.buttonAfterColor },
              ]}
            >
              {activeButton === 'invite' ? (
                <ActiveSvgAddButton width={20} height={20} />
              ) : (
                <SvgAddButton width={20} height={20} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extraButton} onPress={() => handleButtonPress('link')}>
            <View
              style={[
                styles.miniButtons,
                activeButton === 'link' && { backgroundColor: colors.buttonAfterColor },
              ]}
            >
              {activeButton === 'link' ? (
                <ActiveSvgLinkButton width={20} height={20} />
              ) : (
                <SvgLinkButton width={20} height={20} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={toggleButtons} style={styles.buttonContainer}>
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: rotation }] }]}>
          <SvgCircle width={56} height={56} />
          <View style={styles.crossIcon}>
            <SvgCross width={24} height={24} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 25, 
    bottom: 80,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    position: 'relative',
  },
  crossIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }], // 십자가 이미지 위치 조정
  },
  extraButtons: {
    position: 'absolute',
    bottom: 60, // 메인 버튼 위로 나열되게끔 배치
    alignItems: 'center',
  },
  miniButtons: {
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: colors.calendarColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraButton: {
    marginBottom: 12, // 버튼 간격 설정
  },
});

export default MemberManageButton;
