import Modal from "react-native-modal";
import { SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from "react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../styles/colors";
import { memo, useContext, useEffect, useState } from "react";
import apiClient from "../lib/api";
import { UserContext } from "../context/UserContext";
import { SwipeListButton } from "./SwipeListButton";

import Icon from "../assets/icon.svg";
import Goblin from "../assets/goblin.svg";
import X from "../assets/x.svg";
import PlusCircleWhite from "../assets/plus_circle_white.svg";
import Trash from "../assets/trash.svg";
import Door from "../assets/door.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SidebarDrawer = memo(({ navigation }) => {
  //더미
  // const data = Array(20)
  //   .fill("")
  //   .map((_, i) => ({ key: i, id: i, name: i }));

  // const [groupList, setGroupList] = useState([]);

  // 캘린더 목록
  const { data: groupList } = useQuery({
    queryKey: ["getGroups"],
    queryFn: () =>
      apiClient.get(`/api/groups`).then((response) =>
        response.data?.map((d) => ({
          key: d?.groupId,
          id: d?.groupId,
          name: d?.groupName,
          createdBy: d?.createdBy,
        }))
      ),
  });

  // useEffect(() => {
  //   apiClient.get("/api/groups").then((response) => {
  //     setGroupList(
  //       response.data?.map((data) => ({
  //         key: data?.groupId,
  //         id: data?.groupId,
  //         name: data?.groupName,
  //       }))
  //     );
  //   });
  // }, []);

  const { username, groupId, setGroupId } = useContext(UserContext);
  // TODO 리렌더링 줄이기
  // console.log(username);

  const [editName, setEditName] = useState({ id: null, name: "" });

  const [deleteCalendar, setDeleteCalendar] = useState({ open: false, id: null, name: null });

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);

  const queryClient = useQueryClient();

  // 팀 캘린더 생성
  const createNewCalendar = () => {
    groupsPostMutation.mutate({ groupName: `새 캘린더 ${groupList?.length + 1}` });
  };

  const groupsPostMutation = useMutation({
    mutationFn: (data) => apiClient.post(`/api/groups`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroups"] });
    },
  });

  // 캘린더 이름 수정
  const editCalendarName = (id, text) => {
    if (text?.trim()?.length === 0) return;
    groupsEditMutation.mutate({ id, groupName: text });
  };

  const groupsEditMutation = useMutation({
    mutationFn: (data) => apiClient.put(`/api/groups/${data?.id}`, { groupName: data?.groupName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroups"] });
    },
  });

  // 캘린더 삭제
  const _deleteCalendar = (id) => {
    groupsDeleteMutation.mutate({ id });
  };

  const groupsDeleteMutation = useMutation({
    mutationFn: (data) => apiClient.delete(`/api/groups/${data?.id}`, { groupId: data?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroups"] });
    },
  });

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
                onPress={() => {
                  _deleteCalendar(deleteCalendar?.id);
                  setDeleteCalendar((prev) => ({ ...prev, open: false }));
                }}
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
                      onSubmitEditing={({ nativeEvent: { text } }) =>
                        editCalendarName(data?.item?.id, text)
                      }
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
              <SwipeListButton
                data={data}
                rowMap={rowMap}
                onEditPress={() => {
                  setEditName(() => ({ id: data?.item?.id, name: `${data?.item?.name}` }));
                  rowMap[data?.item?.key]?.closeRow();
                }}
                onDeletePress={() =>
                  setDeleteCalendar({ open: true, id: data?.item?.id, name: data?.item?.name })
                }
              />
            )}
            rightOpenValue={-80}
            previewRowKey={"0"}
            previewOpenValue={-40}
          />
          {/* </ScrollView> */}
        </View>
      </View>
      <View style={drawerStyles.newCalendarButtonWrapper}>
        <TouchableOpacity
          style={[drawerStyles.newCalendarButton, { backgroundColor: "#9F9EA4" }]}
          onPress={() => setIsJoinModalOpen(true)}
        >
          <Door width={16} height={16} />
          <Text style={drawerStyles.newCalendarButtonText}>팀 캘린더 입장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={drawerStyles.newCalendarButton}
          onPress={() => createNewCalendar()}
        >
          <PlusCircleWhite width={16} height={16} />
          <Text style={drawerStyles.newCalendarButtonText}>팀 캘린더 생성하기</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isJoinModalOpen}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.6}
        onBackdropPress={() => setIsJoinModalOpen(false)}
        style={drawerStyles.joinModalWrapper}
      >
        <View style={drawerStyles.joinModalContainer}>
          <TouchableOpacity
            style={drawerStyles.joinModalCloseWrapper}
            onPress={() => setIsJoinModalOpen(false)}
          >
            <X width={24} height={24} />
          </TouchableOpacity>
          <Text style={drawerStyles.joinModalHeaderText}>초대 링크 입력</Text>
          <Text style={drawerStyles.joinModalSubHeaderText}>초대받은 링크를 입력해 주세요!</Text>
          <TextInput
            style={drawerStyles.joinModalInviteTextInput}
            value={inviteLink}
            onChangeText={(text) => setInviteLink(text)}
            returnKeyType="done"
            placeholder="초대 링크 입력"
          />
          <TouchableOpacity
            style={[
              drawerStyles.joinModalButton,
              { backgroundColor: inviteLink?.length > 0 ? colors.skyBlue : "#F1F1F5" },
            ]}
            disabled={inviteLink?.length === 0}
          >
            <Text
              style={[
                drawerStyles.joinModalText,
                { color: inviteLink?.length > 0 ? colors.white : "#999999" },
              ]}
            >
              입력 완료
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
});

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
    height: 40,
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
    gap: 8,
  },
  newCalendarButton: {
    paddingVertical: 11,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.skyBlue,
  },
  newCalendarButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: -0.3,
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
  joinModalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  joinModalContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 24,
  },
  joinModalCloseWrapper: {
    marginVertical: 16,
    marginRight: 24,
    alignSelf: "flex-end",
  },
  joinModalHeaderText: {
    paddingLeft: 24,
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  joinModalSubHeaderText: {
    paddingTop: 4,
    paddingLeft: 24,
    color: "#B1B1B1",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  joinModalInviteTextInput: {
    marginHorizontal: 20,
    marginTop: 17,
    marginBottom: 48,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.calendarColor,
  },
  joinModalButton: {
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  joinModalText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19.6,
    letterSpacing: -0.35,
  },
});
