import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "../../styles/colors";
import CalendarNavbar from "../../components/CalendarNavbar";
import { convertToTimeGrid } from "../../lib/convertToTimeGrid";
import { DrawerWrapper } from "../../components/DrawerWrapper";
import { useMemo, useState } from "react";

export default function Daily() {
  //더미
  const [schedule, setSchedule] = useState([
    {
      id: "X",
      title: "X 02:30 ~ 03:30",
      startTime: "02:30",
      endTime: "03:30",
      backgroundColor: "#E8C5E3",
    },
    {
      id: "Y",
      title: "Y 02:00 ~ 04:00",
      startTime: "02:00",
      endTime: "04:00",
      backgroundColor: "#F9EDEB",
    },
    {
      id: "Z",
      title: "Z 04:00 ~ 04:30",
      startTime: "04:00",
      endTime: "04:30",
      backgroundColor: "#B1B0B5",
    },
    {
      id: "W",
      title: "W 05:30 ~ 08:00",
      startTime: "05:30",
      endTime: "08:00",
      backgroundColor: "#A5B4DB",
    },
    {
      id: "A",
      title: "A 03:30 ~ 05:00",
      startTime: "03:30",
      endTime: "05:00",
      backgroundColor: "#E8C5E3",
    },
    {
      id: "B",
      title: "B 02:00 ~ 03:00",
      startTime: "02:00",
      endTime: "03:00",
      backgroundColor: "#DDE9EE",
    },
  ]);

  // console.log(scheduleDummy);

  const DailyComponent = ({ navigation }) =>
    useMemo(() => {
      /* 
        TODO 성능 개선..?
      */

      const [scheduleDummy, maxColumns] = convertToTimeGrid(schedule);

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
            marginBottom: -8,
            paddingRight: 4,
            paddingTop: 2,
            borderBottomWidth: 0.5,
            borderBottomColor: "#E3EFF5",
          },
          timeScheduleBlock: {
            position: "absolute",
            marginTop: 8,
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
        });

        //시간 변환
        const label = hour < 12 ? `오전 ${hour}시` : `오후 ${hour === 12 ? hour : hour - 12}시`;

        return (
          <View style={_styles.timeWrapper}>
            <Text style={_styles.timeLabelText} numberOfLines={1} ellipsizeMode="clip">
              {label}
            </Text>
            <View style={_styles.timeScheduleWrapper}>
              {scheduleDummy
                ?.filter((s) => parseInt(s?.startTime?.split(":")?.[0]) === hour)
                ?.map((schedule, i) => {
                  const initialWidth = Dimensions?.get("window").width - 20 * 2 - (42 - 4) - 4 * 2;
                  const blockWidth =
                    initialWidth *
                      (schedule?.columns > 1
                        ? 1 / (schedule?.columns < maxColumns ? maxColumns : schedule.columns)
                        : 1) -
                    4;
                  const xOffset = 4 + (blockWidth + 4) * schedule?.push;

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
            title="성북뭉게해커톤"
            currentMonth={9}
            onPress={() => navigation.openDrawer()}
          />
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>17일 금요일</Text>
          </View>
          <ScrollView style={styles.timeContainer}>
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            ].map((hour, index) => (
              <TimeBlock key={hour} hour={hour} />
            ))}
          </ScrollView>
        </View>
      );
    }, [schedule]);

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
  timeContainer: {
    paddingTop: 48,
  },
});
