import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from "react-native-calendars";
import colors from "../../styles/colors";
import { LocaleKR } from "../../lib/LocaleConfig";
import { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import CalendarNavbar from "../../components/CalendarNavbar";
import { DrawerWrapper } from "../../components/DrawerWrapper";
import Modal from "react-native-modal";

import Dot from "../../assets/dot.svg";
import ClockGray from "../../assets/clock_gray.svg";
import Pin from "../../assets/pin.svg";
import PlusCircle from "../../assets/plus_circle.svg";
import ArrowLeft from "../../assets/arrow_left.svg";
import { ToggleButton } from "../../components/ToggleButton";
import { NewEventBottomSheet } from "../../components/NewEventBottomSheet";

LocaleConfig.locales.kr = LocaleKR;
LocaleConfig.defaultLocale = "kr";

export default function Monthly() {
  const [today, setToday] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  // 2-2, 2-3
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bottomSheetMode, setBottomSheetMode] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [eventsModal, setEventsModal] = useState({
    date: "9월 20일 (금)",
    events: [
      {
        id: 1,
        date: "오후 1:00 ~ 오후 8:00",
        name: "동아리 OT",
        memo: "18시로 일정이 잡힌다면 30분 정도 참여 가능",
        creator: "홍길동",
        backgroundColor: "#B0CDD4",
        personalEvent: true,
      },
      {
        id: 2,
        date: "오후 1:00 ~ 오후 8:00",
        name: "동아리 OT",
        memo: "18시로 일정이 잡힌다면 30분 정도 참여 가능",
        creator: "홍길동",
        backgroundColor: "#B0CDD4",
        personalEvent: true,
      },
    ],
  });

  const [pinnedEvents, setPinnedEvents] = useState([
    {
      id: 1,
      name: "학생 수업",
      active: false,
      color: "#F2EDD9",
    },
    {
      id: 2,
      name: "학생회",
      active: true,
      color: "#F1DAED",
    },
    {
      id: 3,
      name: "일상",
      active: false,
      color: "#E6E8E3",
    },
    {
      id: 4,
      name: "일상2",
      active: false,
      color: "#E6E8E3",
    },
    {
      id: 5,
      name: "일상3",
      active: false,
      color: "#E6E8E3",
    },
    {
      id: 6,
      name: "일상4",
      active: false,
      color: "#E6E8E3",
    },
  ]);

  const MonthComponent = ({ navigation }) =>
    useMemo(() => {
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
                              ? colors.font04Gray
                              : colors.black,
                          ...(state === "today" && { fontWeight: "700" }),
                        },
                      ]}
                    >{`${date?.day}`}</Text>
                  </View>
                  <TouchableOpacity
                    styles={styles.dayMarkWrapper}
                    onPress={() => {
                      setIsModalOpen(true);
                      setModalMode("view");
                    }}
                  >
                    {(marking?.length > 3 ? marking?.slice(0, 3) : marking)?.map((mark) => (
                      <View key={mark?.title} style={styles.dayMarker}>
                        <Text style={styles.dayMarkerText} numberOfLines={1}>
                          {mark?.title}
                        </Text>
                      </View>
                    ))}
                    {marking?.length > 3 ? (
                      <View style={styles.moreIndicator}>
                        <Dot />
                        <Dot />
                        <Dot />
                      </View>
                    ) : undefined}
                  </TouchableOpacity>
                </View>
              )}
            />
          </CalendarProvider>
        </View>
      );
    }, [currentMonth]);

  return (
    <>
      <DrawerWrapper screen={MonthComponent} />

      <Modal
        isVisible={isModalOpen}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onBackdropPress={() => setIsModalOpen(false)}
        style={styles.eventsModalWrapper}
      >
        <View style={styles.eventsModalContainer}>
          {/* 일정 목록 */}
          {modalMode === "view" && (
            <>
              <Text style={styles.eventsModalHeader}>{eventsModal?.date}</Text>
              <View style={styles.eventsModalContent}>
                <ScrollView
                  style={styles.eventsModalEventWrapper}
                  contentContainerStyle={{ gap: 24 }}
                >
                  {eventsModal?.events?.map((event, i) => (
                    <View style={styles.eventsModalEventContainer} key={event?.id}>
                      <View
                        style={[
                          styles.eventsModalEventDot,
                          { backgroundColor: event?.backgroundColor },
                        ]}
                      ></View>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.eventsModalEventName} numberOfLines={1}>
                          {event?.name}
                        </Text>
                        <Text style={styles.eventsModalEventMemo} numberOfLines={1}>
                          {event?.memo}
                        </Text>
                        <View style={styles.eventsModalInfoWrapper}>
                          <View style={styles.eventsModalEventChip}>
                            <Text style={styles.eventsModalEventChipText}>{event?.creator}</Text>
                          </View>
                          <View style={styles.eventsModalEventDateWrapper}>
                            <ClockGray width={12} height={12} />
                            <Text style={styles.eventsModalEventDateText}>{event?.date}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.eventsModalButtonWrapper}>
                  <TouchableOpacity
                    style={[styles.eventsModalButton, { backgroundColor: colors.skyBlue }]}
                    onPress={() => setModalMode("pin")}
                  >
                    <Pin width={20} height={20} />
                    <Text style={styles.eventsModalButtonText}>고정 일정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.eventsModalButton, { backgroundColor: "#69CCA3" }]}
                    onPress={() => {
                      setIsBottomSheetOpen(true);
                      setBottomSheetMode("new_common_event");
                    }}
                  >
                    <PlusCircle width={16} height={16} />
                    <Text style={styles.eventsModalButtonText}>새 일정 추가</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {/* 고정 일정 선택 */}
          {modalMode === "pin" && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TouchableOpacity onPress={() => setModalMode("view")}>
                  <ArrowLeft width={20} height={20} />
                </TouchableOpacity>
                <Text style={styles.eventsModalHeader}>고정 일정 선택</Text>
              </View>
              <View style={styles.eventsModalContent}>
                <ScrollView style={[styles.eventsModalEventWrapper, { gap: 8 }]}>
                  {pinnedEvents?.map((event, i) => (
                    <View key={event?.id}>
                      <View style={styles.eventsModalPinnedEventContainer}>
                        <View style={styles.eventsModalPinnedEventContent}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                            <View
                              style={[
                                styles.eventsModalPinnedEventDot,
                                { backgroundColor: event?.color },
                              ]}
                            ></View>
                            <Text style={styles.eventsModalPinnedEventText} numberOfLines={1}>
                              {event?.name}
                            </Text>
                          </View>
                          <ToggleButton
                            active={event?.active}
                            containerStyle={{
                              width: 36,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: colors.lightGrayBG,
                              borderWidth: 1,
                              borderColor: event?.active ? colors.skyBlue : "#E5E5EC",
                            }}
                            buttonStyle={{
                              margin: 2,
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              backgroundColor: event?.active ? colors.skyBlue : "#E5E5EC",
                            }}
                            onPress={() =>
                              setPinnedEvents((prev) => [
                                ...prev.map((d) =>
                                  d?.id === event?.id ? { ...d, active: !d?.active } : d
                                ),
                              ])
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.eventsModalPinnedEventDivider}></View>
                    </View>
                  ))}
                </ScrollView>
                <View style={[styles.eventsModalButtonWrapper]}>
                  <TouchableOpacity
                    style={[
                      styles.eventsModalButton,
                      { width: "auto", flex: 1, backgroundColor: colors.skyBlue },
                    ]}
                    onPress={() => setModalMode("pin")}
                  >
                    <PlusCircle width={15} height={15} />
                    <Text style={styles.eventsModalButtonText}>고정 일정 추가</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
      {/* 새 일반 일정 추가 */}
      {isBottomSheetOpen && (
        <>
          {bottomSheetMode === "new_common_event" && (
            <NewEventBottomSheet setIsBottomSheetOpen={setIsBottomSheetOpen} />
          )}
        </>
      )}
    </>
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
  eventsModalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  eventsModalContainer: {
    position: "relative",
    height: 500,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  eventsModalEventWrapper: {
    marginTop: 16,
    width: 241,
    gap: 24,
  },
  eventsModalEventContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  eventsModalHeader: {
    color: colors.font02Gray,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  eventsModalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventsModalEventDot: {
    width: 6,
    height: 6,
    marginTop: 8,
    marginRight: 20,
    borderRadius: "100%",
  },
  eventsModalEventName: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  eventsModalEventMemo: {
    marginTop: 4,
    color: colors.fontGray,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },
  eventsModalInfoWrapper: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  eventsModalEventChip: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: 100,
    backgroundColor: "#B0CDD4",
  },
  eventsModalEventChipText: {
    color: colors.white,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  eventsModalEventDateWrapper: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  eventsModalEventDateText: {
    marginLeft: 2,
    color: colors.fontGray,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },
  eventsModalButtonWrapper: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  eventsModalButton: {
    paddingVertical: 11,
    width: 116,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
  },
  eventsModalButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  eventsModalPinnedEventContainer: {
    paddingVertical: 10,
    flexDirection: "row",
  },
  eventsModalPinnedEventContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  eventsModalPinnedEventDot: {
    width: 10,
    height: 10,
    borderRadius: "100%",
  },
  eventsModalPinnedEventText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  eventsModalPinnedEventDivider: {
    height: 1,
    marginVertical: 8,
    backgroundColor: colors.ButtonDisableGray,
  },
});
