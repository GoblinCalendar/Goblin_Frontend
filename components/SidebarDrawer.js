import Modal from "react-native-modal";
import { ScrollView } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from "react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../styles/colors";

import Icon from "../assets/icon.svg";
import Goblin from "../assets/goblin.svg";
import X from "../assets/x.svg";
import AddCircleOutline from "../assets/add_circle_outline.svg";
import Pencil from "../assets/pencil.svg";
import Trash from "../assets/trash.svg";
import { useContext, useEffect, useState } from "react";
import apiClient from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAsyncStorage from "../hooks/useAsyncStorage";
import { GroupContext, GroupCotext } from "../context/GroupContext";

export const SidebarDrawer = ({ navigation }) => {
  //더미
  // const data = Array(20)
  //   .fill("")
  //   .map((_, i) => ({ key: i, id: i, name: i }));

  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    apiClient.get("/api/groups").then((response) => {
      setGroupList(
        response.data?.map((data) => ({
          key: data?.groupId,
          id: data?.groupId,
          name: data?.groupName,
        }))
      );
    });
  }, []);

  const [username, setUsername] = useAsyncStorage("username");
  // TODO 리렌더링 고치기
  console.log(username);

  const { groupId, setGroupId } = useContext(GroupContext);

  const [editName, setEditName] = useState({ id: null, name: "" });

  const [deleteCalendar, setDeleteCalendar] = useState({ open: false, id: null, name: null });

  return (
    <View style={drawerStyles.wrapper}>
      <View style={{ flex: 1 }}>
        {/* 캘린더 삭제 모달 */}
        <Modal
          isVisible={deleteCalendar?.open}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => setDeleteCalendar((prev) => ({ ...prev, open: false }))}
          style={drawerStyles.deleteCalendarModalWrapper}
        >
          <View style={drawerStyles.deleteCalendarModalContainer}>
            <View style={drawerStyles.deleteCalendarModalIcon}>
              <Trash width={50} height={50} />
            </View>
            <Text style={drawerStyles.deleteCalendarModalName} numberOfLines={1}>
              '{deleteCalendar?.name}'
            </Text>
            <Text style={drawerStyles.deleteCalendarModalAreYouSure}>
              {`해당 캘린더를 삭제하시겠습니까?\n삭제된 캘린더는 복구할 수 없습니다.`}
            </Text>
            <View style={drawerStyles.deleteCalendarModalButtonWrapper}>
              <TouchableOpacity
                style={[
                  drawerStyles.deleteCalendarModalButton,
                  { backgroundColor: colors.lightGray },
                ]}
                onPress={() => setDeleteCalendar((prev) => ({ ...prev, open: false }))}
              >
                <Text
                  style={[drawerStyles.deleteCalendarModalButtonText, { color: colors.font04Gray }]}
                >
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  drawerStyles.deleteCalendarModalButton,
                  { backgroundColor: colors.deleteButtonRed },
                ]}
                onPress={() => console.log("delete calendar")}
              >
                <Text style={[drawerStyles.deleteCalendarModalButtonText, { color: colors.white }]}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Drawer */}
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
            onPress={() => setGroupId(null)}
          >
            {groupId === null && <View style={drawerStyles.calendarIndicator}></View>}
            <Text
              style={[
                drawerStyles.calendarText,
                ...(groupId === null
                  ? [
                      {
                        color: colors.skyBlue,
                        fontWeight: "600",
                      },
                    ]
                  : []),
              ]}
            >
              {username}님의 캘린더
            </Text>
          </Pressable>
        </View>
        <View style={drawerStyles.teamCalendarWrapper}>
          <Text style={drawerStyles.calendarLabel}>팀 캘린더</Text>
          {/* <ScrollView style={drawerStyles.scrollWrapper}> */}
          <SwipeListView
            disableRightSwipe={true}
            data={groupList}
            renderItem={(data, rowMap) => (
              <Pressable
                style={drawerStyles.calendarContainer}
                onPress={() => setGroupId(data?.item?.id)}
              >
                {groupId === data?.item?.id && <View style={drawerStyles.calendarIndicator}></View>}
                {data?.item?.id === editName?.id ? (
                  <View style={drawerStyles.editCalendarNameWrapper}>
                    <TextInput
                      style={drawerStyles.editCalendarNameTextInput}
                      numberOfLines={1}
                      maxLength={13}
                      autoFocus={true}
                      enterKeyHint="done"
                      autoComplete="off"
                      onChangeText={(text) =>
                        setEditName((prev) => ({ ...prev, name: text?.trim() }))
                      }
                      onSubmitEditing={({ nativeEvent: { text } }) => {
                        // Done 누름
                        console.log(editName);
                      }}
                      onBlur={() => setEditName({ id: null, name: "" })}
                      value={`${editName?.name}`}
                    />
                    <Text style={drawerStyles.editCalendarNameCounter}>
                      {`${editName?.name?.length}`}/13
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      drawerStyles.calendarText,
                      ...(groupId === data?.item?.id
                        ? [
                            {
                              color: colors.skyBlue,
                              fontWeight: "600",
                            },
                          ]
                        : []),
                    ]}
                  >
                    {data.item.name}
                  </Text>
                )}
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
                  onPress={() => {
                    setEditName(() => ({ id: data?.item?.id, name: `${data?.item?.name}` }));
                    rowMap[data?.item?.key]?.closeRow();
                  }}
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
                  onPress={() =>
                    setDeleteCalendar({ open: true, id: data?.item?.id, name: data?.item?.name })
                  }
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
    paddingRight: 24,
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
    marginTop: 32,
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
  editCalendarNameWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editCalendarNameTextInput: {
    width: "auto",
  },
  editCalendarNameCounter: {
    color: colors.font04Gray,
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 16,
    marginRight: -24,
  },
  deleteCalendarModalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCalendarModalContainer: {
    paddingTop: 27,
    paddingBottom: 22,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 26,
  },
  deleteCalendarModalIcon: {
    padding: 10,
    marginHorizontal: 77,
    borderRadius: "100%",
    backgroundColor: colors.deleteButtonRed,
  },
  deleteCalendarModalName: {
    marginTop: 10,
    color: colors.black,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  deleteCalendarModalAreYouSure: {
    marginTop: 4,
    color: colors.font04Gray,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: -0.275,
  },
  deleteCalendarModalButtonWrapper: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  deleteCalendarModalButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteCalendarModalButtonText: {
    color: colors.font04Gray,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: -0.275,
  },
});
