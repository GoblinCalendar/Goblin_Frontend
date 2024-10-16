import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "../../styles/colors";
import CalendarNavbar from "../../components/CalendarNavbar";
import { convertToTimeGrid } from "../../lib/convertToTimeGrid";
import { DrawerWrapper } from "../../components/DrawerWrapper";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getDay } from "../../lib/getDay";
import { useQueries, useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/api";

import ClockGray from "../../assets/clock_gray.svg";
import { UserContext } from "../../context/UserContext";
import { all } from "axios";

export default function Daily() {
  const [today, setToday] = useState(new Date());

  const { groupId, personalGroupId } = useContext(UserContext);

  // now
  const [now, setNow] = useState({
    hour: today.getHours() % 12 || 12,
    minute: today.getMinutes(),
    yOffset:
      48 * (today.getHours() % 12 || 12) +
      4 * (today.getHours() % 12 || 12) +
      48 * Number((today.getMinutes() / 60).toFixed(2)),
  });

  // 현재 시각 separator의 y값 계산
  const getNowYOffset = (hour, minute) =>
    48 * hour + 4 * hour + 48 * Number((minute / 60).toFixed(2));

  //
  const reload = () => {
    setNow({
      hour: new Date().getHours() % 12 || 12,
      minute: new Date().getMinutes(),
      yOffset: getNowYOffset(new Date().getHours() % 12 || 12, new Date().getMinutes()),
    });
  };

  // 현재 시간 업데이트
  useEffect(() => {
    // mount 되었을 때 남은 초 계산
    const currentSeconds = today.getSeconds(); // Get the current seconds (0-59)
    let beforeMountSeconds = 60 - currentSeconds;

    const initialTimer = new Promise((resolve, reject) =>
      setTimeout(() => {
        reload();
        resolve(true);
      }, beforeMountSeconds)
    );

    let timer;

    initialTimer.then(() => {
      timer = setInterval(() => {
        reload();
      }, 60);
    });

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, []);

  //더미
  // const [schedule, setSchedule] = useState([
  //   {
  //     id: "X",
  //     title: "X 02:30 ~ 03:30",
  //     startTime: "02:30",
  //     endTime: "03:30",
  //     backgroundColor: "#E8C5E3",
  //   },
  //   {
  //     id: "Y",
  //     title: "Y 02:00 ~ 04:00",
  //     startTime: "02:00",
  //     endTime: "04:00",
  //     backgroundColor: "#F9EDEB",
  //   },
  //   {
  //     id: "Z",
  //     title: "Z 04:00 ~ 04:30",
  //     startTime: "04:00",
  //     endTime: "04:30",
  //     backgroundColor: "#B1B0B5",
  //   },
  //   {
  //     id: "W",
  //     title: "W 05:30 ~ 08:00",
  //     startTime: "05:30",
  //     endTime: "08:00",
  //     backgroundColor: "#A5B4DB",
  //   },
  //   {
  //     id: "A",
  //     title: "A 03:30 ~ 05:00",
  //     startTime: "03:30",
  //     endTime: "05:00",
  //     backgroundColor: "#E8C5E3",
  //   },
  //   {
  //     id: "B",
  //     title: "B 02:00 ~ 03:00",
  //     startTime: "02:00",
  //     endTime: "03:00",
  //     backgroundColor: "#DDE9EE",
  //   },
  // ]);

  // console.log(scheduleDummy);

  // 모든 일별 일정 한번에
  const DailyComponent = ({ navigation }) => {
    const successfulQueriesCounter = useRef(0);

    const allDailyEvents = useQueries({
      queries: [
        {
          queryKey: ["getDailyEvents"],
          queryFn: async () => {
            const query =
              groupId === personalGroupId
                ? `/api/calendar/user/view-day?year=${today?.getFullYear()}&month=${
                    today?.getMonth() + 1
                  }&day=${today?.getDate()}`
                : `/api/groups/${groupId}/calendars/confirmed/day?year=${today?.getFullYear()}&month=${
                    today?.getMonth() + 1
                  }&day=${today?.getDate()}`;

            return apiClient.get(query).then((response) =>
              response.data?.map((d) => {
                const startTimeDate = new Date(d?.startTime || d?.startDateTime);
                const endTimeDate = new Date(d?.endTime || d?.endDateTime);

                return {
                  id: String(d?.id),
                  title: d?.title,
                  startTime: `${startTimeDate?.getHours()}:${startTimeDate?.getMinutes()}`,
                  endTime: `${endTimeDate?.getHours()}:${endTimeDate?.getMinutes()}`,
                  backgroundColor: `#${d?.color || "A5B4DB"}`,
                };
              })
            );
          },
          enabled: !!groupId,
          initialData: [],
          onSuccess: () => {
            successfulQueriesCounter.current = successfulQueriesCounter.current + 1;
          },
        },
        {
          queryKey: ["getDailyPinnedEvents"],
          queryFn: async () => {
            const query =
              groupId === personalGroupId
                ? `/api/fixed/personal-group/schedules`
                : `/api/fixed/group/${groupId}`;

            return apiClient.get(query).then((response) =>
              response.data?.map((d) => {
                return {
                  id: String(d?.id),
                  title: d?.scheduleName,
                  startTime: d?.startTime,
                  endTime: d?.endTime,
                  backgroundColor: "#A5B4DB",
                };
              })
            );
          },
          enabled: !!groupId,
          initialData: [],
          onSuccess: () => {
            successfulQueriesCounter.current = successfulQueriesCounter.current + 1;
          },
        },
      ],
    });

    return useMemo(() => {
      /* 
        TODO 성능 개선..? + convertToTimeGrid 캐싱?
      */

      const [scheduleDummy, maxColumns] = convertToTimeGrid([
        ...allDailyEvents?.[1]?.data,
        ...allDailyEvents?.[0]?.data,
      ]);

      const TimeBlock = ({ hour }) => {
        const _styles = StyleSheet.create({
          timeWrapper: {
            paddingHorizontal: 20,
            flexDirection: "row",
          },
          timeLabelText: {
            width: 42,
            marginRight: 4,
            color: "#999999",
            textAlign: "right",
            fontSize: 11,
            fontWeight: "400",
            lineHeight: 16,
            letterSpacing: -0.275,
          },
          timeScheduleWrapper: {
            position: "relative",
            flex: 1,
            height: 60,
            marginTop: 8,
            paddingRight: 4,
            paddingTop: 2,
            borderTopWidth: 0.5,
            borderTopColor: "#E3EFF5",
          },
          timeScheduleBlock: {
            position: "absolute",
            paddingHorizontal: 8,
            paddingBottom: 8,
            paddingTop: 4,
            borderRadius: 4,
          },
          timeScheduleBlockText: {
            color: "#505050",
            fontSize: 11,
            fontWeight: "400",
            lineHeight: 12,
            letterSpacing: -0.275,
          },
          timeIndicatorWrapper: {
            position: "absolute",
            bottom: 4,
            right: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          },
          timeIndicator: {
            color: colors.font04Gray,
            fontSize: 11,
            fontWeight: "400",
            lineHeight: 12,
            letterSpacing: -0.275,
          },
        });

        //시간 변환
        const label = hour < 12 ? `오전 ${hour === 0 ? 12 : hour}시` : `오후 ${hour % 12 || 12}시`;

        return (
          <View style={_styles.timeWrapper}>
            <Text style={_styles.timeLabelText} numberOfLines={1} ellipsizeMode="clip">
              {label}
            </Text>
            <View style={_styles.timeScheduleWrapper}>
              {scheduleDummy?.length > 0 &&
                scheduleDummy
                  ?.filter((s) => parseInt(s?.startTime?.split(":")?.[0]) === hour)
                  ?.map((schedule, i) => {
                    const initialWidth =
                      Dimensions?.get("window").width - 20 * 2 - (42 - 4) - 4 * 2;
                    const blockWidth =
                      initialWidth *
                        (schedule?.columns > 1
                          ? 1 / (schedule?.columns < maxColumns ? maxColumns : schedule.columns)
                          : 1) -
                      4;
                    const xOffset = 4 + (blockWidth + 4) * schedule?.push;

                    const startTimeHour = schedule?.startTime?.split(":")?.[0] % 12 || 12;
                    const startTimeMinute = String(schedule?.startTime?.split(":")?.[1])?.padStart(
                      2,
                      "0"
                    );
                    const startTimeLabel =
                      startTimeHour < 12
                        ? `오전 ${startTimeHour}:${startTimeMinute}`
                        : `오후 ${startTimeHour}:${startTimeMinute}`;

                    const endTimeHour = schedule?.endTime?.split(":")?.[0] % 12 || 12;
                    const endTimeMinute = String(schedule?.endTime?.split(":")?.[1])?.padStart(
                      2,
                      "0"
                    );
                    const endTimeLabel =
                      endTimeHour < 12
                        ? `오전 ${endTimeHour}:${endTimeMinute}`
                        : `오후 ${endTimeHour}:${endTimeMinute}`;

                    return (
                      <View
                        key={schedule?.id}
                        style={[
                          _styles.timeScheduleBlock,
                          {
                            top: schedule?.yOffset,
                            left: xOffset,
                            width: blockWidth || "auto",
                            height: schedule?.calculatedHeight || "auto",
                            backgroundColor: schedule?.backgroundColor,
                          },
                        ]}
                      >
                        <Text style={_styles.timeScheduleBlockText}>{schedule?.title}</Text>
                        <View style={_styles.timeIndicatorWrapper}>
                          <ClockGray width={12} height={12} />
                          <Text style={_styles.timeIndicator}>
                            {startTimeLabel} ~ {endTimeLabel}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
            </View>
          </View>
        );
      };

      return (
        <View style={styles.container}>
          <CalendarNavbar
            currentMonth={today?.getMonth() + 1}
            onPress={() => navigation.openDrawer()}
          />
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>
              {today.getDate()}일 {getDay(today.getDay())}요일
            </Text>
          </View>
          <View style={styles.timeWrapper}>
            <ScrollView style={styles.timeContainer}>
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                23,
              ].map((hour, index) => (
                <TimeBlock key={hour} hour={hour} />
              ))}
              <View style={[styles.nowSeparatorWrapper, { top: now.yOffset }]}>
                {/* 현재 시각 */}
                <Text style={styles.nowTimeText}>
                  {String(now.hour).padStart(2, "0")}:{String(now.minute).padStart(2, "0")}
                </Text>
                <View style={styles.nowSeparator}></View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }, [now?.yOffset, successfulQueriesCounter.current]);
  };

  return <DrawerWrapper screen={DailyComponent} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  dateHeaderContainer: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.skyBlue,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  dateHeaderText: {
    color: "#F7F7F7",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  timeWrapper: { flex: 1, paddingTop: 48 },
  timeContainer: {
    position: "relative",
  },
  nowSeparatorWrapper: {
    position: "absolute",
    top: 8,
    paddingLeft: 39,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nowTimeText: {
    color: colors.skyBlue,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: -0.275,
  },
  nowSeparator: {
    width: Dimensions.get("window").width - 20 - 66,
    height: 2,
    backgroundColor: colors.skyBlue,
  },
});
