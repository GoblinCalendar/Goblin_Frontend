import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import ButtonComponent from '../../../components/Button';
import colors from '../../../styles/colors';
import { useRouter } from 'expo-router';
import { EventContext } from '../../../context/EventContext';

const buttonWidth = 335; // 버튼의 고정 너비

const EventCompleteScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
    const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산 
    const { eventDetails } = useContext(EventContext);

    const handleNextPress = () => {
        router.push('/monthly');
    };

    // 날짜 배열을 그룹화하여 문자열로 변환
    const getGroupedDates = () => {
        const dateArray = eventDetails.dates.sort();
        const groupedDates = [];
        let tempGroup = [dateArray[0]];

        for (let i = 1; i < dateArray.length; i++) {
            const prevDate = new Date(tempGroup[tempGroup.length - 1]);
            const currentDate = new Date(dateArray[i]);

            if ((currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
                tempGroup.push(dateArray[i]);
            } else {
                groupedDates.push([...tempGroup]);
                tempGroup = [dateArray[i]];
            }
        }
        groupedDates.push([...tempGroup]);

        return groupedDates.map(group => {
            if (group.length === 1) {
                return `${new Date(group[0]).getMonth() + 1}.${new Date(group[0]).getDate()}`;
            } else {
                const start = new Date(group[0]);
                const end = new Date(group[group.length - 1]);
                return `${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`;
            }
        }).join(' | ');
    };

    return (
        <View style={[styles.container, { width }]}>

            {/* 이벤트 이름 문구 */}
            <Text style={styles.titleText}>
                {eventDetails.name}
            </Text>

            <Text style={styles.subTitleText}>일정 생성 완료</Text>

            <View style={styles.rowIndex}>
                {/* 소요 시간 문구 */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require('../../../assets/sandglass.png')}
                            style={styles.icon} 
                        />
                        <Text style={styles.infoValue}>{eventDetails.duration} 소요 예상</Text>
                    </View>
                </View>
                
                {/* 참여자 이름 문구 */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require('../../../assets/membergray.png')}
                            style={styles.icon} 
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.participants}>
                                {eventDetails.participants.map((participant, index) => (
                                    <View key={index} style={styles.participantTag}>
                                        <Text style={styles.participantName}>{participant}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* 선택 날짜 문구 */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require('../../../assets/calendargray.png')}
                            style={styles.icon} 
                        />
                        <Text style={styles.infoValue}>{getGroupedDates()}</Text>
                    </View>
                </View>

                {/* 시작,종료 시간 문구 */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require('../../../assets/clockgray.png')}
                            style={styles.icon} 
                        />
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeLabel}>시작</Text>
                            <View style={styles.timeBox}>
                                <Text style={styles.timeValue}>{eventDetails.startTime}</Text>
                            </View>
                            <Text style={styles.divider}> | </Text>
                            <Text style={styles.timeLabel}>종료</Text>
                            <View style={styles.timeBox}>
                                <Text style={styles.timeValue}>{eventDetails.endTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 장소 문구 */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require('../../../assets/place.png')}
                            style={styles.icon} 
                        />
                        <Text style={styles.infoValue}>{eventDetails.place ? eventDetails.place : '-'}</Text>
                    </View>
                </View>
            </View>

            {/* 다음 버튼 */}
            <ButtonComponent
                title="일정 공유하기"
                style={[styles.button, { left: horizontalPadding }]}
                isActive='true'
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
    top: 104,
    left: 25,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 42,
    color: colors.black,
    textAlign: 'left',
  },
  subTitleText: {
    position: 'absolute',
    top: 150,
    left: 25,
    fontSize: 32,
    color: colors.black,
    textAlign: 'left',
    fontWeight: '400',
  },
  rowIndex: {
    position: 'absolute',
    top: 240,
    left: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    height: 40,
    width: 350,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderColor: colors.eventCompleteLine,
    // width: '100%',
    // marginBottom: 10,
  },
  icon: {
    width: 24, 
    height: 24, 
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: colors.black,
  },
  participants: {
    flexDirection: 'row',
  },
  participantTag: {
    backgroundColor: colors.buttonAfterColor,
    borderColor: colors.buttonAfterColor,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 7,
    paddingHorizontal: 15,
    margin: 5,
  },
  participantName: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBox: {
    backgroundColor: colors.buttonAfterColor,
    borderRadius: 6,
    height: 26,
    width: 85,
    alignItems: 'center',
    justifyContent: 'center',
  marginLeft: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  divider: {
    fontSize: 16,
    color: colors.gray,
    marginHorizontal: 5,
  },
  button: {
    position: 'absolute',
    top: 734, 
  },
});

export default EventCompleteScreen;
