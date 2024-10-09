import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../styles/colors";
import Clock from "../assets/clock.svg";

const TimePicker = ({ style, startTime, endTime, setStartTime, setEndTime, keepOpened }) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(""); // 'start' or 'end'
  const [selectedTime, setSelectedTime] = useState({
    hour: "12",
    minute: "00",
    ampm: "오전",
  });

  // mount 되자마자
  useEffect(() => {
    if (keepOpened) openTimePicker("start");
  }, []);

  // 오전/오후 옵션
  const ampmSet = ["오전", "오후"];

  // 시간 옵션 (1~12)
  const hourOptions = [...Array(12).keys()].map((i) => `${i + 1}`);

  const openTimePicker = (type) => {
    setPickerType(type);
    setIsTimePickerVisible(true);
  };

  // selectedTime이 바뀔 때마다 시간 설정 및 리렌더링
  useEffect(() => {
    const time = `${selectedTime.ampm} ${selectedTime.hour} : ${selectedTime.minute}`;

    if (pickerType === "start") {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
  }, [selectedTime]);

  const handleTimePickerConfirm = () => {
    if (!keepOpened) setIsTimePickerVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {/* 시간 선택 */}
      <View style={styles.timeSelection}>
        <Clock style={styles.icon} />
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>시작</Text>
          <TouchableOpacity
            style={[
              styles.timeButton,
              endTime !== "-" || pickerType === "start"
                ? {
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                : { backgroundColor: "rgba(255, 255, 255, 0.5)" },
            ]}
            onPress={() => openTimePicker("start")}
          >
            <Text style={styles.startTimeText}>{startTime}</Text>
          </TouchableOpacity>
          <Text style={styles.devide}>ㅣ</Text>
          <Text style={styles.timeText}>종료</Text>
          <TouchableOpacity
            style={[
              styles.timeButton,
              endTime !== "-" || pickerType === "end"
                ? {
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                : { backgroundColor: "rgba(255, 255, 255, 0.5)" },
            ]}
            onPress={() => openTimePicker("end")}
          >
            <Text style={styles.endTimeText}>{endTime}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 타임피커 */}
      {isTimePickerVisible && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.allpickerContainer}
            activeOpacity={1}
            onPress={() => handleTimePickerConfirm()}
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime.ampm}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, ampm: value }))}
              >
                {ampmSet.map((ampm) => (
                  <Picker.Item key={ampm} label={ampm} value={ampm} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedTime.hour}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, hour: value }))}
              >
                {hourOptions.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
              <Text style={styles.colonText}>:</Text>
              <Picker
                selectedValue={selectedTime.minute}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                onValueChange={(value) => setSelectedTime((prev) => ({ ...prev, minute: value }))}
              >
                {["00", "15", "30", "45"].map((minute) => (
                  <Picker.Item key={minute} label={minute} value={minute} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 424,
    width: 335,
  },
  timeSelection: {
    marginBottom: 5,
    width: 335,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.calendarColor,
    borderRadius: 12,
    alignSelf: "center",
  },
  icon: {
    marginLeft: 8,
    width: 24,
    height: 24,
  },
  timeTextContainer: {
    flexDirection: "row",
    marginLeft: 24,
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  devide: {
    color: colors.gray,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 3,
  },
  timeText: {
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 14,
    color: colors.black,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 6,
    width: 80,
    height: 26,
    justifyContent: "center",
    marginLeft: 7,
  },
  startTimeText: {
    fontSize: 12,
    color: colors.black,
    textAlign: "center",
  },
  endTimeText: {
    fontSize: 12,
    color: colors.black,
    textAlign: "center",
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    width: 335,
    alignSelf: "center",
  },
  allpickerContainer: {
    backgroundColor: colors.buttonBeforeColor,
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 12,
  },
  picker: {
    width: 100,
    height: 180,
  },
  pickerItem: {
    height: 180,
    fontSize: 20,
  },
  colonText: {
    fontSize: 25,
    color: colors.gray,
    paddingHorizontal: 5,
  },
});

export default TimePicker;
