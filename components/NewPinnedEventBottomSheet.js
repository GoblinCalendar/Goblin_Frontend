import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import colors from "../styles/colors";
import { BottomSheetModalComponent } from "./BottomSheetModalComponent";
import TimePicker from "./TimePicker";
import { TouchableOpacity } from "react-native-gesture-handler";

import ButtonComponent from "./Button";
import Radio from "../assets/radio.svg";
import RadioActive from "../assets/radio_active.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetTextInput } from "./BottomSheetTextInput";
import apiClient from "../lib/api";
import { convertToAmPm } from "../lib/convertToAmPm";

export const NewPinnedEventBottomSheet = ({
  setIsBottomSheetOpen,
  initialData,
  setInitialData,
  setIsModalOpen,
}) => {
  // ref
  const bottomSheetRef = useRef(null);

  // 일정 이름 및 메모
  const [newEvent, setNewEvent] = useState({ name: initialData?.title || "" });
  const [selectMode, setSelectMode] = useState("time");

  // console.log(initialData);

  // 날 선택
  const [days, setDays] = useState(
    [
      { day: "일", id: "SUNDAY", selected: false },
      { day: "월", id: "MONDAY", selected: false },
      { day: "화", id: "TUESDAY", selected: false },
      { day: "수", id: "WEDNESDAY", selected: false },
      { day: "목", id: "THURSDAY", selected: false },
      { day: "금", id: "FRIDAY", selected: false },
      { day: "토", id: "SATURDAY", selected: false },
    ].map((d) => ({
      ...d,
      selected: !!initialData ? initialData?.dayOfWeek?.some((i) => i === d?.id) : false,
    }))
  );

  //시간 선택
  const [startTime, setStartTime] = useState(
    initialData?.date?.split("~")?.[0]?.trim()?.replace(":", " : ") || "-"
  );
  const [endTime, setEndTime] = useState(
    initialData?.date?.split("~")?.[1]?.trim()?.replace(":", " : ") || "-"
  );

  // console.log(startTime, endTime);

  //색 선택
  const colorsMap = [
    { id: 1, color: "#F3DAD8" },
    { id: 2, color: "#F1DAED" },
    { id: 3, color: "#F2EDD9" },
    { id: 4, color: "#EBEBE3" },
    { id: 5, color: "#B1B0B5" },
  ];

  const [selectedColor, setSelectedColor] = useState(
    colorsMap.find((c) => c.color === initialData?.color) || null
  );

  // 고정 일정 추가 or 수정
  const createNewPinnedEvent = () => {
    const startTimeFrags = startTime?.split(" ");
    const endTimeFrags = endTime?.split(" ");

    const payload = {
      scheduleName: newEvent?.name,
      dayOfWeek: days.filter((d) => d.selected).map((d) => d.id),
      amPmStart: convertToAmPm(startTimeFrags?.[0]),
      startHour: parseInt(startTimeFrags?.[1]),
      startMinute: parseInt(startTimeFrags?.[3]),
      amPmEnd: convertToAmPm(endTimeFrags?.[0]),
      endHour: parseInt(endTimeFrags?.[1]),
      endMinute: parseInt(endTimeFrags?.[3]),
      colorCode: selectedColor.id,
      public: true, //기본값 공개
    };

    if (!!initialData) {
      editNewPinnedEventMutation.mutate(payload);
    } else {
      createNewPinnedEventMutation.mutate(payload);
    }

    setIsBottomSheetOpen(false);
  };

  //mutate
  const queryClient = useQueryClient();

  // 추가
  const createNewPinnedEventMutation = useMutation({
    mutationFn: (data) => apiClient.post("/api/fixed/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPinnedEvents"] });
      setInitialData(null);
      setIsModalOpen(false);
    },
  });

  // 수정
  const editNewPinnedEventMutation = useMutation({
    mutationFn: (data) => apiClient.put(`/api/fixed/${initialData?.id}/update`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPinnedEvents"] });
      setInitialData(null);
      setIsModalOpen(false);
    },
  });

  return (
    <BottomSheetModalComponent
      setIsBottomSheetOpen={setIsBottomSheetOpen}
      setInitialData={setInitialData}
      bottomSheetRef={bottomSheetRef}
      height={selectMode === "time" ? 510 : 352}
    >
      <View style={styles.headerWrapper}>
        <BottomSheetTextInput
          value={newEvent?.name}
          style={styles.header}
          placeholder="고정 일정 이름을 입력하세요"
          numberOfLines={1}
          maxLength={18}
          placeholderTextColor={colors.font05Gray}
          onChangeText={(text) => setNewEvent((prev) => ({ ...prev, name: text }))}
          autoFocus={true}
          returnKeyType="done"
          editable={!(selectMode === "color")}
        />
        <Text style={styles.maxLengthText}>{newEvent?.name?.length || 0}/18</Text>
      </View>

      <View style={styles.content}>
        {selectMode === "time" && (
          <>
            <View style={styles.daysWrapper}>
              {days.map((d, i) => (
                <TouchableOpacity
                  style={[
                    styles.daysButton,
                    ...(d.selected ? [{ backgroundColor: colors.skyBlue }] : []),
                  ]}
                  key={d.day}
                  onPress={() =>
                    setDays((prev) => [
                      ...prev.map((m) => (m.day === d.day ? { ...m, selected: !m.selected } : m)),
                    ])
                  }
                >
                  <Text
                    style={[styles.daysLabel, ...(d.selected ? [{ color: colors.white }] : [])]}
                  >
                    {d.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TimePicker
              style={{ marginTop: 24, height: 258, alignSelf: "center" }}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              keepOpened={true}
            />
            <ButtonComponent
              style={{ marginTop: 24, width: "auto" }}
              title="다음"
              isActive={
                newEvent?.name?.length > 0 &&
                startTime !== "-" &&
                endTime !== "-" &&
                days.some((d) => d.selected)
              }
              onPress={() => setSelectMode("color")}
            />
          </>
        )}

        {selectMode === "color" && (
          <>
            <Text style={styles.selectColorText}>5가지 색상 중 1개를 선택해 주세요</Text>
            <View style={styles.colorsWrapper}>
              {colorsMap.map((c, i) => (
                <View style={styles.colorsContainer} key={c.id}>
                  <View style={[styles.colorsCircle, { backgroundColor: c.color }]}></View>
                  <TouchableOpacity
                    style={styles.colorsRadioButton}
                    onPress={() => setSelectedColor(() => (selectedColor?.id === c.id ? null : c))}
                  >
                    {selectedColor?.id === c.id ? (
                      <RadioActive width={24} height={24} />
                    ) : (
                      <Radio width={24} height={24} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <ButtonComponent
              style={{ marginTop: 48, width: "auto" }}
              title={!!initialData ? "수정하기" : "추가하기"}
              isActive={
                newEvent?.name?.length > 0 &&
                startTime !== "-" &&
                endTime !== "-" &&
                days.some((d) => d.selected) &&
                selectedColor !== null
              }
              onPress={() => createNewPinnedEvent()}
            />
          </>
        )}
      </View>
    </BottomSheetModalComponent>
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
  selectorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  daysWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  daysButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  daysLabel: {
    color: colors.font05Gray,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  selectColorText: {
    color: colors.font04Gray,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    lterr: -0.35,
  },
  colorsWrapper: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  colorsContainer: {
    alignItems: "center",
    gap: 24,
  },
  colorsCircle: {
    width: 42,
    height: 42,
    borderRadius: "100%",
  },
});
