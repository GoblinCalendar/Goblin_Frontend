import { StyleSheet, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from "react-native-calendars";
import colors from "../../styles/colors";
import { LocaleKR } from "../../lib/LocaleConfig";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import Dot from "../../assets/dot.svg";
import CalendarNavbar from "../../components/CalendarNavbar";

LocaleConfig.locales.kr = LocaleKR;
LocaleConfig.defaultLocale = "kr";

export default function Monthly() {
  const [today, setToday] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  //더미
  const markedDates = {
    "2024-09-29": [
      {
        marked: true,
        title: "가나다라",
      },
      {
        marked: true,
        title: "마바사아",
      },
      {
        marked: true,
        title: "자차카타",
      },
      {
        marked: true,
        title: "파하",
      },
    ],
    "2024-09-13": [{ marked: true, title: "test" }],
  };

  return (
    <View style={styles.container}>
      <CalendarNavbar title="성북뭉게해커톤" currentMonth={currentMonth} />
      <CalendarProvider date="2024-09-29" onMonthChange={(date) => setCurrentMonth(date?.month)}>
        <ExpandableCalendar
          theme={{
            todayBackgroundColor: colors.skyBlue,
            todayTextColor: colors.white,
            "stylesheet.calendar.main": {
              week: {
                flexDirection: "row",
                justifyContent: "space-around",
                borderBottomWidth: 1,
                borderBottomColor: "#F1F1F1",
              },
              dayContainer: {
                flex: 1,
              },
            },
            "stylesheet.calendar.header": {
              dayHeader: {
                color: "#505050",
                fontSize: 12,
                fontWeight: "400",
                lineHeight: 18,
                letterSpacing: -0.3,
              },
            },
          }}
          weekHeight={1500} /* ! 임의의 큰 값 */
          markedDates={markedDates}
          calendarStyle={styles.calendar}
          headerStyle={styles.calendarHeader}
          initialPosition="open"
          hideArrows={true}
          hideKnob={true}
          renderHeader={() => null}
          disablePan={true}
          allowShadow={false}
          monthFormat="M월"
          markingType="custom"
          dayComponent={({ date, state, marking }) => (
            <View style={[styles.dayWrapper, { height: 121 }]}>
              <View
                style={[
                  styles.dayNumberWrapper,
                  {
                    ...(state === "today" && {
                      backgroundColor: colors.skyBlue,
                      borderRadius: 5,
                      marginBottom: 8,
                    }),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color:
                        state === "today"
                          ? colors.white
                          : state === "disabled"
                          ? colors.darkGray
                          : colors.black,
                      ...(state === "today" && { fontWeight: "700" }),
                    },
                  ]}
                >{`${date?.day}`}</Text>
              </View>
              <View styles={styles.dayMarkWrapper}>
                {(marking?.length > 3 ? marking?.slice(0, 3) : marking)?.map((mark) => (
                  <TouchableOpacity key={mark?.title} style={styles.dayMarker}>
                    <Text style={styles.dayMarkerText} numberOfLines={1}>
                      {mark?.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                {marking?.length > 3 ? (
                  <TouchableOpacity style={styles.moreIndicator}>
                    <Dot />
                    <Dot />
                    <Dot />
                  </TouchableOpacity>
                ) : undefined}
              </View>
            </View>
          )}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  calendar: {
    height: "100%",
    paddingRight: 0,
    paddingLeft: 0,
  },
  calendarHeader: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  dayWrapper: {
    alignItems: "center",
  },
  dayNumberWrapper: {
    width: 24,
    height: 24,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  dayMarkWrapper: {
    flex: 1,
    marginTop: 8,
    alignItems: "center",
  },
  dayMarker: {
    width: 49,
    marginBottom: 4,
    marginHorizontal: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
  },
  dayMarkerText: {
    color: "#505050",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: -0.275,
  },
  moreIndicator: {
    flexDirection: "row",
    gap: 4,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
