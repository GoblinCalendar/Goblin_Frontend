import { Pressable, StyleSheet, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from "react-native-calendars";
import colors from "../../styles/colors";
import { LocaleKR } from "../../lib/LocaleConfig";
import { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import CalendarNavbar from "../../components/CalendarNavbar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ScrollView } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Dot from "../../assets/dot.svg";
import Icon from "../../assets/icon.svg";
import Goblin from "../../assets/goblin.svg";
import X from "../../assets/x.svg";
import AddCircleOutline from "../../assets/add_circle_outline.svg";
import Pencil from "../../assets/pencil.svg";
import Trash from "../../assets/trash.svg";

LocaleConfig.locales.kr = LocaleKR;
LocaleConfig.defaultLocale = "kr";

export default function Monthly() {
  const [today, setToday] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const Drawer = createDrawerNavigator();
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

  const Main = ({ navigation }) =>
    useMemo(
      () => (
        <View style={styles.container}>
          <CalendarNavbar
            title="성북뭉게해커톤"
            currentMonth={currentMonth}
            onPress={() => navigation.openDrawer()}
          />
          <CalendarProvider
            date="2024-09-29"
            onMonthChange={(date) => setCurrentMonth(date?.month)}
          >
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
      ),
      [currentMonth]
    );

  const data = Array(20)
    .fill("")
    .map((_, i) => ({ key: i, data: i }));

  return (
    <Drawer.Navigator
      initialRouteName="main"
      drawerContent={({ navigation }) => (
        <View style={drawerStyles.wrapper}>
          <View style={{ flex: 1 }}>
            <View style={drawerStyles.header}>
              <View style={drawerStyles.logo}>
                <Icon />
                <Goblin />
              </View>
              <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                <X />
              </TouchableOpacity>
            </View>
            <View style={drawerStyles.myCalendarWrapper}>
              <Text style={drawerStyles.calendarLabel}>내 캘린더</Text>
              <Pressable
                style={[drawerStyles.calendarContainer, { paddingLeft: 4 }]}
                onPress={() => console.log("me")}
              >
                <Text style={drawerStyles.calendarText}>권기남님의 캘린더</Text>
              </Pressable>
            </View>
            <View style={drawerStyles.teamCalendarWrapper}>
              <Text style={drawerStyles.calendarLabel}>팀 캘린더</Text>
              {/* <ScrollView style={drawerStyles.scrollWrapper}> */}
              <SwipeListView
                disableRightSwipe={true}
                data={data}
                renderItem={(data, rowMap) => (
                  <Pressable
                    style={drawerStyles.calendarContainer}
                    onPress={() => console.log("team")}
                  >
                    <View style={drawerStyles.calendarIndicator}></View>
                    <Text
                      style={[
                        drawerStyles.calendarText,
                        { color: colors.skyBlue, fontWeight: "600" },
                      ]}
                    >
                      강북 구름 뭉게톤 {data.item.key}
                    </Text>
                  </Pressable>
                )}
                renderHiddenItem={(data, rowMap) => (
                  <View style={drawerStyles.sideButtonWrapper}>
                    <TouchableOpacity
                      style={[
                        drawerStyles.sideButton,
                        {
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                          backgroundColor: "#7BB872",
                        },
                      ]}
                    >
                      <Pencil />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        drawerStyles.sideButton,
                        {
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                          backgroundColor: "#DE5E56",
                        },
                      ]}
                    >
                      <Trash />
                    </TouchableOpacity>
                  </View>
                )}
                rightOpenValue={-80}
                previewRowKey={"0"}
                previewOpenValue={-40}
              />
              {/* </ScrollView> */}
            </View>
          </View>
          <View style={drawerStyles.newCalendarButtonWrapper}>
            <TouchableOpacity style={drawerStyles.newCalendarButton}>
              <AddCircleOutline />
              <Text style={drawerStyles.newCalendarButtonText}>새 그룹 달력 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        drawerType: "front",
        swipeEnabled: false,
        overlayColor: "transparent",
        drawerStyle: {
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          borderColor: "#CEE7F3",
          borderWidth: 1,
          shadowColor: "black",
          shadowOffset: {
            height: 0,
            width: 4,
          },
          shadowRadius: 4,
          shadowOpacity: 0.04,
        },
      }}
    >
      <Drawer.Screen name="main">{Main}</Drawer.Screen>
    </Drawer.Navigator>
  );
}

const drawerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  scrollWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#F1F1F5",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  myCalendarWrapper: {
    marginTop: 16,
  },
  calendarLabel: {
    color: "#505050",
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: -0.25,
  },
  calendarContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 32,
    backgroundColor: colors.white,
  },
  calendarText: {
    color: "#484848",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  teamCalendarWrapper: {
    flex: 1,
    marginTop: 24,
  },
  calendarIndicator: {
    width: 2,
    height: 20,
    marginRight: 6,
    backgroundColor: colors.skyBlue,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  newCalendarButtonWrapper: {
    paddingTop: 40,
  },
  newCalendarButton: {
    paddingVertical: 11,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderColor: colors.skyBlue,
    borderWidth: 1,
    backgroundColor: "rgba(93, 174, 214, 0.15)",
  },
  newCalendarButtonText: {
    color: colors.skyBlue,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  sideButtonWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  sideButton: {
    width: 40,
    height: 40,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

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
