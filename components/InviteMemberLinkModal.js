import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import colors from "../styles/colors";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import apiClient from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/UserContext";

const InviteMemberLinkModal = ({ isVisible, onClose }) => {
  // const link = 'https://abcd.ef/goblin_calender'; // 임의 링크 설정
  const { groupId } = useContext(UserContext);
  const [link, setLink] = useState(""); // API로 받은 링크를 저장할 상태

  useEffect(() => {
    // API 호출 함수
    const fetchInviteLink = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await apiClient.post(
          `/api/groups/${groupId}/invite-link`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLink(response.data); // 응답받은 링크 설정
      } catch (error) {
        console.error("초대 링크를 가져오는 중 오류 발생:", error);
      }
    };

    if (isVisible) {
      fetchInviteLink(); // 모달이 열릴 때만 호출
    }
  }, [isVisible, groupId]);

  // 링크 복사 함수
  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(link); // Expo Clipboard의 비동기 함수 사용
    Toast.show({
      type: "successToast",
      text1: "초대 링크가 복사되었습니다!",
      position: "bottom",
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      useNativeDriver={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>

        {/* 모달 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>초대 링크</Text>
          <Text style={styles.subText}>링크를 공유해 함께할 멤버를 초대해보세요!</Text>
        </View>

        {/* 링크 */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText} numberOfLines={1}>
            {link}
          </Text>
        </View>

        {/* 복사하기 버튼 */}
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
          <Text style={styles.copyButtonText}>복사하기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 327,
    height: 309,
    backgroundColor: colors.white,
    borderRadius: 16,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    fontSize: 30,
  },
  header: {
    flexDirection: "column",
    marginTop: 56,
    marginLeft: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
  },
  subText: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.LineDisabled,
    marginTop: 5,
  },
  linkContainer: {
    width: 287,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.calendarColor,
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  linkText: {
    color: colors.black,
    fontSize: 12,
    marginLeft: 10,
  },
  copyButton: {
    color: colors.skyBlue,
    backgroundColor: colors.buttonAfterColor,
    borderRadius: 100,
    position: "absolute",
    top: 241,
    alignSelf: "center",
    width: 108,
    height: 48,
    justifyContent: "center",
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    alignSelf: "center",
  },
});

export default InviteMemberLinkModal;
