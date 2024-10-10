import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import ButtonComponent from "../../../components/Button";
import colors from "../../../styles/colors";
import { useRouter } from "expo-router";
import { EventContext } from "../../../context/EventContext";
import SandGlass from "../../../assets/sandglass.svg";
import Member from "../../../assets/member.svg";
import CalendarGray from "../../../assets/calendar_darkgray.svg";
import ClockGray from "../../../assets/clock_darkgray.svg";
import Place from "../../../assets/place.svg";
import apiClient from "../../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../../context/UserContext";

const buttonWidth = 335; // 버튼의 고정 너비

const EventCompleteScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions(); // 현재 화면의 너비와 높이 가져오기
  const horizontalPadding = (width - buttonWidth) / 2; // 기기 너비에 따른 좌우 여백 계산
  const { eventDetails } = useContext(EventContext);
  const { groupId } = useContext(UserContext);

  const handleNextPress = () => {
    router.push("/monthly");
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

    return groupedDates
      .map((group) => {
        if (group.length === 1) {
          return `${new Date(group[0]).getMonth() + 1}.${new Date(group[0]).getDate()}`;
        } else {
          const start = new Date(group[0]);
          const end = new Date(group[group.length - 1]);
          return `${start.getMonth() + 1}.${start.getDate()} ~ ${
            end.getMonth() + 1
          }.${end.getDate()}`;
        }
      })
      .join(" | ");
  };

  // 소요 시간을 분 단위로 변환하는 함수
  const convertDurationToMinutes = (duration) => {
    const [hours] = duration.split(" ");
    const totalMinutes = parseInt(hours) * 60;
    return totalMinutes;
  };

  // 시간을 AM/PM 형식으로 변환하는 함수
  const convertTimeToAmPm = (time) => {
    // 시간 형식이 "오전 8 : 00", "오후 2 : 00" 이런 식으로 들어오는 경우 처리
    const timeMatch = time.match(/(오전|오후)\s*(\d+)\s*:\s*(\d+)/);
  
    if (!timeMatch) {
      console.error("시간 형식이 잘못되었습니다:", time);
      return {
        amPm: null,
        hour: null,
        minute: null,
      };
    }
  
    const ampm = timeMatch[1]; // 오전/오후
    const hour = parseInt(timeMatch[2], 10); // 시
    const minute = parseInt(timeMatch[3], 10); // 분
  
    // 오전/오후 처리
    const amPm = ampm === "오전" ? "AM" : "PM";
    const adjustedHour = amPm === "PM" && hour !== 12 ? hour % 12 + 12 : hour % 12;
  
    return {
      amPm,
      hour: adjustedHour,
      minute,
    };
  };

  // API 호출을 위한 데이터를 변환하는 함수
  const prepareEventDetailsForApi = () => {
    const { name, dates, duration, startTime, endTime, place, participants } = eventDetails;

    const groupedDates = dates.map((date) => new Date(date).toISOString().slice(0, 10)); // YYYY-MM-DD 형식 변환

    const durationInMinutes = convertDurationToMinutes(duration);

    const start = convertTimeToAmPm(startTime);
    const end = convertTimeToAmPm(endTime);

    console.log("start", start);
    console.log("end", end);

    let placeField = place;
    let linkField = null;

    // 장소에 http가 포함되어 있으면 링크로 설정
    if (place && place.includes("http")) {
      linkField = place;
      placeField = null;
    } else if (!place || place.trim() === "") {
      placeField = ""; // 장소가 비어있으면 null로 설정
    }

    const eventData = {
      title: name,
      dates: groupedDates,
      duration: durationInMinutes,
      timeRange: {
        startAmPm: start.amPm,
        startHour: start.hour,
        startMinute: start.minute,
        endAmPm: end.amPm,
        endHour: end.hour,
        endMinute: end.minute,
      },
      place: placeField,
      link: linkField,
      note: null, // 노트는 null로 보냄
      participants: participants,
    };

    return eventData;
  };

  // API 호출 함수
  const submitEventToApi = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const eventData = prepareEventDetailsForApi();

    console.log("eventData", eventData);
    try {
      await apiClient.post(`/api/groups/${groupId}/calendar`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("그룹 일정 등록이 완료되었습니다.");
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error.message);
      if (error.response && error.response.data) {
        console.error("응답 에러 데이터:", error.response.data); // 에러 응답 본문도 로그 출력
      }
    }
  };

  useEffect(() => {
    submitEventToApi(); // 컴포넌트가 로드될 때 API 호출
  }, []);

  return (
    <View style={[styles.container, { width }]}>
      {/* 이벤트 이름 문구 */}
      <Text style={styles.titleText}>{eventDetails.name}</Text>

      <Text style={styles.subTitleText}>일정 생성 완료</Text>

      <View style={styles.rowIndex}>
        {/* 소요 시간 문구 */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <SandGlass style={styles.icon} />
            <Text style={styles.infoValue}>{eventDetails.duration} 소요 예상</Text>
          </View>
        </View>

        {/* 참여자 이름 문구 */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Member style={styles.icon} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.participants}>
                {eventDetails.participantsDetails.map((participant, index) => (
                  <View key={index} style={styles.participantTag}>
                    <Text style={styles.participantName}>{participant.username}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* 선택 날짜 문구 */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <CalendarGray style={styles.icon} />
            <Text style={styles.infoValue}>{getGroupedDates()}</Text>
          </View>
        </View>

        {/* 시작,종료 시간 문구 */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <ClockGray style={styles.icon} />
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
            <Place style={styles.icon} />
            <Text style={styles.infoValue}>{eventDetails.place ? eventDetails.place : "-"}</Text>
          </View>
        </View>
      </View>

      {/* 다음 버튼 */}
      <ButtonComponent
        title="일정 공유하기"
        style={[styles.button, { left: horizontalPadding }]}
        isActive="true"
        onPress={handleNextPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignSelf: "center",
  },
  titleText: {
    position: "absolute",
    top: 104,
    left: 25,
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 42,
    color: colors.black,
    textAlign: "left",
  },
  subTitleText: {
    position: "absolute",
    top: 150,
    left: 25,
    fontSize: 32,
    color: colors.black,
    textAlign: "left",
    fontWeight: "400",
  },
  rowIndex: {
    position: "absolute",
    top: 240,
    left: 25,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: 40,
    width: 350,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
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
    fontWeight: "700",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBox: {
    backgroundColor: colors.buttonAfterColor,
    borderRadius: 6,
    height: 26,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.black,
    textAlign: "center",
    fontWeight: "500",
  },
  timeValue: {
    fontSize: 12,
    color: colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
  divider: {
    fontSize: 16,
    color: colors.gray,
    marginHorizontal: 5,
  },
  button: {
    position: "absolute",
    top: 754,
  },
});

export default EventCompleteScreen;
