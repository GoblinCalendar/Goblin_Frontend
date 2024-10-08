import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
import BackButton from '../../components/BackButton';
import colors from '../../styles/colors';
import { useRouter } from 'expo-router';
import MemberManageButton from '../../components/MemberManageButton';
import SvgCheckMark from '../../assets/check.svg';
import InviteMemberModal from '../../components/InviteMemberModal';
import InviteMemberLinkModal from '../../components/InviteMenberLinkModal';
import apiClient from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 가상의 멤버 데이터
// const initialMemberData = [
//     { id: '1', name: '김민지', username: 'abcd1234' },
//     { id: '2', name: '강민지', username: 'abcd1234' },
//     { id: '3', name: '송민지', username: 'abcd1234' },
//     { id: '4', name: '이민지', username: 'abcd1234' },
//     { id: '5', name: '장민지', username: 'abcd1234' },
//     { id: '6', name: '박민지', username: 'abcd1234' },
// ];

// 임의로 groupId를 1로 설정
const groupId = 1;

const MemberHostView = () => {
    const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 멤버들 저장
    const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 활성화 여부
    const [memberData, setMemberData] = useState([]); // 멤버 데이터 관리
    const [isInviteModalVisible, setInviteModalVisible] = useState(false); // 초대 모달 상태 관리
    const [isInviteLinkModalVisible, setInviteLinkModalVisible] = useState(false); // 초대 링크 모달 상태 관리
    const router = useRouter();

    const groupName = '성북구름뭉게톤';  // 모임 이름
    const memberCount = memberData.length;  // 멤버 수

    // API 호출하여 멤버 데이터를 가져오는 함수
    const fetchMemberData = async () => {
        try {
            await AsyncStorage.getItem('accessToken');
    
            await apiClient.get(`/api/groups/${groupId}/members`);
    
            const formattedData = response.data.map((member, index) => ({
                id: index.toString(),
                name: member.username,
                username: member.loginId,
            }));
            setMemberData(formattedData);  // API에서 받은 데이터를 memberData로 설정
        } catch (error) {
            console.error("API 호출 에러:", error);
        }
    };

    useEffect(() => {
        fetchMemberData();  // 화면이 로드될 때 멤버 데이터를 가져옴
    }, []);

    const toggleMemberSelection = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(memberId => memberId !== id)); // 선택 해제
        } else {
            setSelectedMembers([...selectedMembers, id]); // 멤버 선택
        }
    };

    // 멤버 강제 퇴장 처리
    const handleRemoveMembers = () => {
        // 선택된 멤버들을 제외한 나머지 멤버들로 상태 업데이트
        setMemberData(memberData.filter(member => !selectedMembers.includes(member.id)));
        // 선택된 멤버 초기화
        setSelectedMembers([]);
        // 삭제 모드 해제
        setDeleteMode(false);
        // setIsOpen(false);
    };

    // 초대 모달 열기/닫기
    const openInviteModal = () => {
        setInviteModalVisible(true);
    };

    const closeInviteModal = () => {
        setInviteModalVisible(false);
    };

    // 초대 링크 모달 열기/닫기
    const openInviteLinkModal = () => {
        setInviteLinkModalVisible(true);
    };

    const closeInviteLinkModal = () => {
        setInviteLinkModalVisible(false);
    };

    const renderMemberItem = ({ item }) => (
        <View style={styles.memberItem}>
            {/* 삭제 모드일 때만 체크박스 표시 */}
            {deleteMode && (
            <TouchableOpacity onPress={() => toggleMemberSelection(item.id)}>
                <View style={styles.checkBoxContainer}>
                    <View
                    style={[
                        styles.checkBox,
                        { backgroundColor: selectedMembers.includes(item.id) ? colors.buttonAfterColor : colors.checkBoxGray },
                    ]}
                    >
                        <SvgCheckMark width={16} height={16}/>
                    </View>
                </View>
            </TouchableOpacity>
            )}
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.devide}>  |  </Text>
            <Text style={styles.memberUsername}>{item.username}</Text>
        </View>
    );

    return(
        <View style={styles.container}>
            {/* BackButton 컴포넌트 */}
            <BackButton navigateTo='/monthly'/>

            {/* 모임 이름 */}
            <Text style={styles.titleText}>{groupName}</Text>

            <Text style={styles.subTitleText}>
                참여 멤버 ({memberCount})
                {/* 멤버 삭제 버튼 */}
                {deleteMode && (
                <TouchableOpacity onPress={handleRemoveMembers}>
                    <View style={styles.deleteButtonContainer}>
                        <Text style={styles.deleteButtonText}>강제 퇴장</Text>
                    </View>
                </TouchableOpacity>
            )}
            </Text>

            {/* 멤버 리스트 */}
            <FlatList
                data={memberData}
                renderItem={renderMemberItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.memberList}
            />

            <MemberManageButton
                setDeleteMode={setDeleteMode}
                openInviteModal={openInviteModal}
                openInviteLinkModal={openInviteLinkModal}  // 초대 링크 모달 열기 전달
            />
            <InviteMemberModal isVisible={isInviteModalVisible} onClose={closeInviteModal} />
            <InviteMemberLinkModal isVisible={isInviteLinkModalVisible} onClose={closeInviteLinkModal} />


        </View>
    )
    
};
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white,
        position: 'relative',
    },
    titleText: {
        fontWeight: '600',
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        color: colors.black,
        height: 28,
        marginTop: 70,
    },
    subTitleText: {
        fontSize: 24,
        color: colors.black,
        height: 34,
        marginTop: 20,
        marginLeft: 25,
        position: 'relative',
    },
    memberList: {
        marginTop: 24,
        marginLeft: 25,
    },
    memberItem: {
        paddingLeft: 20,
        height: 64,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: colors.ButtonDisableGray,
        borderBottomWidth: 1,
        width: 335,
    },
    checkBoxContainer: {
        marginRight: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '600',
    },
    devide: {
        fontSize: 14,
        color: colors.calendarColor,
    },
    memberUsername: {
        fontSize: 14,
        color: colors.font04Gray,
    },

    deleteButtonContainer: {
        position: 'absolute',
        width: 75,
        height: 28,
        top: -20,
        left: 140,
        borderRadius: 8,
        backgroundColor: colors.deleteButtonRed,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    deleteButtonText: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.white,
    },
});

export default MemberHostView;
