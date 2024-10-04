import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";
import { ScrollView } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Icon from "../assets/icon.svg";
import Goblin from "../assets/goblin.svg";
import X from "../assets/x.svg";
import AddCircleOutline from "../assets/add_circle_outline.svg";
import Pencil from "../assets/pencil.svg";
import Trash from "../assets/trash.svg";
import { TouchableOpacity } from "react-native";

export const SidebarDrawer = ({ navigation }) => {
  //더미
  const data = Array(20)
    .fill("")
    .map((_, i) => ({ key: i, data: i }));

  return (
    <View style={drawerStyles.wrapper}>
      <View style={{ flex: 1 }}>
        <View style={drawerStyles.header}>
          <View style={drawerStyles.logo}>
            <Icon width={32} height={32} />
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
              <Pressable style={drawerStyles.calendarContainer} onPress={() => console.log("team")}>
                <View style={drawerStyles.calendarIndicator}></View>
                <Text
                  style={[drawerStyles.calendarText, { color: colors.skyBlue, fontWeight: "600" }]}
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
  );
};

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
