import { Portal } from "@gorhom/portal";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import colors from "../styles/colors";
import { BottomSheetModalComponent } from "./BottomSheetModalComponent";
import CalendarPicker from "./CalendarPicker";
import moment from "moment";

import CalendarIcon from "../assets/calendar.svg";
import CalendarBlack from "../assets/calendar_black.svg";
import ClockIcon from "../assets/clock.svg";
import ClockBlack from "../assets/clock_black.svg";
import ButtonComponent from "./Button";
import TimePicker from "./TimePicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import apiClient from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetTextInput } from "./BottomSheetTextInput";
import { convertToAmPm } from "../lib/convertToAmPm";

export const NewCommonEventBottomSheet = ({ setIsBottomSheetOpen, initialStartDay }) => {
  // ref
  const bottomSheetRef = useRef(null);

  // 일정 이름 및 메모
  const [newEvent, setNewEvent] = useState({ name: "", memo: "" });
  const [selectMode, setSelectMode] = useState("calendar");

  // 날짜 선택
  const [selectedDates, setSelectedDates] = useState({
    [initialStartDay || moment().format("YYYY-MM-DD")]: {
      color: "#5DAED6",
      endingDay: true,
      startingDay: true,
    },
  });
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);

  const handleReset = () => {
    setSelectedDates({});
    setStartDay(null);
    setEndDay(null);
  };

  //시간 선택
  const [startTime, setStartTime] = useState("-");
  const [endTime, setEndTime] = useState("-");

  // console.log(startTime, endTime);

  // 일정 추가 API
  const createNewEvent = () => {
    const startTimeFrags = startTime?.split(" ");
    const endTimeFrags = endTime?.split(" ");

    mutation.mutate({
      title: newEvent?.name,
      note: newEvent?.memo,
      date: Object.keys(selectedDates),
      amPmStart: convertToAmPm(startTimeFrags?.[0]),
      startHour: parseInt(startTimeFrags?.[1]),
      startMinute: parseInt(startTimeFrags?.[3]),
      amPmEnd: convertToAmPm(endTimeFrags?.[0]),
      endHour: parseInt(endTimeFrags?.[1]),
      endMinute: parseInt(endTimeFrags?.[3]),
    });
  };

  //mutate
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => apiClient.post("/api/calendar/user/save", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGeneralEvents"] });
      setIsBottomSheetOpen(false);
    },
  });

  return (
    <BottomSheetModalComponent
      setIsBottomSheetOpen={setIsBottomSheetOpen}
      bottomSheetRef={bottomSheetRef}
      height={selectMode === "calendar" ? 617 : 512}
    >
      <View style={styles.headerWrapper}>
        <BottomSheetTextInput
          value={newEvent?.name}
          style={styles.header}
          placeholder="일정 이름을 입력하세요"
          numberOfLines={1}
          maxLength={18}
          placeholderTextColor={colors.font05Gray}
          onChangeText={(text) => setNewEvent((prev) => ({ ...prev, name: text?.trim() }))}
          autoFocus={true}
          returnKeyType="done"
        />
        <Text style={styles.maxLengthText}>{newEvent?.name?.length || 0}/18</Text>
      </View>
      <BottomSheetTextInput
        value={newEvent?.memo}
        style={styles.memo}
        placeholder="메모를 입력하세요 (선택)"
        numberOfLines={1}
        maxLength={22}
        placeholderTextColor={colors.font04Gray}
        onChangeText={(text) => setNewEvent((prev) => ({ ...prev, memo: text?.trim() }))}
        returnKeyType="done"
      />
      <View style={styles.selectorWrapper}>
        {selectMode === "calendar" ? (
          <CalendarIcon width={20} height={20} />
        ) : (
          <TouchableOpacity onPress={() => setSelectMode("calendar")}>
            <CalendarBlack width={20} height={20} />
          </TouchableOpacity>
        )}
        <View style={styles.calendarDateTextWrapper}>
          <Text style={styles.calendarDateText}>
            {Object.keys(selectedDates).length > 0
              ? Object.keys(selectedDates).length > 1
                ? "다중 기간"
                : moment(Object.keys(selectedDates)?.[0])?.format("M월 D일")
              : "날짜를 선택하세요"}
          </Text>
        </View>

        {selectMode === "time" ? (
          <ClockIcon width={20} height={20} style={{ marginLeft: 12 }} />
        ) : (
          <TouchableOpacity
            onPress={() =>
              newEvent?.name?.length > 0 &&
              Object.keys(selectedDates).length &&
              setSelectMode("time")
            }
          >
            <ClockBlack width={20} height={20} style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {selectMode === "calendar" && (
          <>
            <CalendarPicker
              startDay={startDay}
              setStartDay={setStartDay}
              endDay={endDay}
              setEndDay={setEndDay}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleReset={handleReset}
              style={{ width: "100%" }}
              customHeader={customHeader}
            />
            <ButtonComponent
              style={{ marginTop: 24, width: "auto" }}
              title="다음"
              isActive={newEvent?.name?.length > 0 && Object.keys(selectedDates).length}
              onPress={() => setSelectMode("time")}
            />
          </>
        )}

        {selectMode === "time" && (
          <>
            <TimePicker
              style={{ height: 258, alignSelf: "center" }}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              keepOpened={true}
            />
            <ButtonComponent
              style={{ marginTop: 24, width: "" }}
              title="추가하기"
              isActive={startTime !== "-" && endTime !== "-"}
              onPress={() => {
                createNewEvent();
                setIsBottomSheetOpen(false);
              }}
            />
          </>
        )}
      </View>
    </BottomSheetModalComponent>
  );
};

const customHeader = (date) => {
  const year = date?.getFullYear() || "";
  const month = date ? date.getMonth() + 1 : "";
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          color: colors.font04Gray,
          fontSize: 12,
          fontWeight: "400",
          lineHeight: 18,
          letterSpacing: -0.3,
        }}
      >
        {year}
      </Text>
      <Text
        style={{
          color: colors.black,
          fontSize: 18,
          fontWeight: "600",
          lineHeight: 28,
          letterSpacing: -0.45,
        }}
      >
        {month}월
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.45,
  },
  content: {
    marginTop: 16,
    flex: 1,
  },
  maxLengthText: {
    color: colors.font04Gray,
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 16,
  },
  memo: {
    marginTop: 4,
    color: colors.font04Gray,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  selectorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  calendarDateTextWrapper: {
    marginLeft: 4,
    paddingVertical: 2,
    paddingHorizontal: 21,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.calendarColor,
  },
  calendarDateText: {
    color: colors.black,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: -0.3,
  },
});
