import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import BackButton from '../../../components/BackButton';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';
import { EventContext } from '../../../context/EventContext';
import apiClient from '../../../lib/api';


const buttonWidth = 335; // 버튼의 고정 너비

const EventPeopleScreen = () => {
    const [selectedFriends, setSelectedFriends] = useState([]);
    const router = useRouter();
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산 
    const { setEventDetails } = useContext(EventContext);

    // 더미 데이터
  const friends = [
    "김민수", "박지영", "이준호", "최은지", "강현우", 
    "허윤호", "오세훈", "윤서진", "신동민", "권지현",
    "김현서", "강민서", "권기남", "서현은", "이지원"
  ];

  const handleFriendSelect = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter(name => name !== friend));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleNextPress = () => {
    if (selectedFriends.length > 0) {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        participants: selectedFriends,
      }));
      router.push('/createEventHostView/eventPlace');
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* BackButton 컴포넌트 */}
      <BackButton navigateTo='/createEventHostView/eventDate'/>

      {/* 타이틀 문구 */}
      <Text style={styles.titleText}>
        일정에 같이 참여할{"\n"}
        구성원을 선택해 주세요
      </Text>

      {/* 구성원 선택 */}
      <TouchableOpacity style={[styles.memberButton, { zIndex: 2 }]}>
        <View style={styles.frameChild} />
        <Image style={styles.icon} resizeMode="cover" source={require('../../../assets/member.png')} />
        <ScrollView 
          horizontal 
          contentContainerStyle={styles.selectedFriendsContainer} 
          showsHorizontalScrollIndicator={false}
        >
          {selectedFriends.length === 0 ? (
            <Text style={styles.placeholderText}>참여 인원 선택</Text>
          ) : (
            selectedFriends.map((friend, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.friendButton, styles.selectedFriend]} 
                  onPress={() => handleFriendSelect(friend)} // 선택 해제 기능
                >
                  <Text style={[styles.friendText, styles.selectedText]}>
                    {friend}
                  </Text>
                </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </TouchableOpacity>

      {/* 구성원 목록 */}
      <ScrollView contentContainerStyle={styles.friendList} pointerEvents="box-none">
        {friends.map((friend, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.friendButton,
              selectedFriends.includes(friend) ? styles.selectedFriend : styles.unselectedFriend
            ]}
            onPress={() => handleFriendSelect(friend)}
          >
            <Text style={[
              styles.friendText,
              selectedFriends.includes(friend) ? styles.selectedText : styles.unselectedText
            ]}>
              {friend}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {/* 다음 버튼 */}
      <ButtonComponent
        title="다음"
        style={[styles.button, { left: horizontalPadding }]}
        isActive={selectedFriends.length > 0} // 선택된 친구가 있을 때만 활성화
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
    fontWeight: '500',
    lineHeight: 34,
    color: colors.black,
    textAlign: 'left',
  },
  memberButton: {
    position: 'absolute',
    top: 260, 
    left: 30,
    width: buttonWidth,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
  },
  frameChild: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
    backgroundColor: colors.calendarColor,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    left: 10,
  },
  selectedFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.gray,
    paddingLeft: 80,
  },
  friendList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 330,
    marginLeft: 30,
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    width: buttonWidth,
    paddingVertical: 10,
  },
  friendButton: {
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 7,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedFriend: {
    borderColor: colors.buttonAfterColor,
    backgroundColor: colors.buttonAfterColor,
  },
  unselectedFriend: {
    borderColor: colors.buttonBeforeColor,
    backgroundColor: colors.white,
  },
  friendText: {
    fontSize: 12,
  },
  selectedText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  unselectedText: {
    color: colors.memberFontColor,
  },
  button: {
    position: 'absolute',
    top: 714, 
  },
});

export default EventPeopleScreen;
