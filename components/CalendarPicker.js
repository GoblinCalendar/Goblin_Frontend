import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import colors from "../styles/colors";
import { LocaleKR } from "../lib/LocaleConfig";

// Locale 설정
LocaleConfig.locales.kr = LocaleKR;
LocaleConfig.defaultLocale = "kr";

const CalendarPicker = ({
  selectedDates,
  setSelectedDates,
  startDay,
  setStartDay,
  endDay,
  setEndDay,
  handleComplete,
  handleReset,
  style,
  customHeader,
}) => {
  const handleDayPress = (day) => {
    let newSelectedDates = { ...selectedDates };

    if (!startDay || (startDay && endDay)) {
      setStartDay(day.dateString);
      setEndDay(null);
      newSelectedDates = {
        ...newSelectedDates,
        [day.dateString]: { startingDay: true, endingDay: true, color: colors.buttonAfterColor },
      };
    } else {
      const markedDates = {};
      let currentDate = startDay;
      while (currentDate <= day.dateString) {
        markedDates[currentDate] = {
          color: colors.buttonAfterColor,
          textColor: "white",
          ...(currentDate === startDay && { startingDay: true }),
          ...(currentDate === day.dateString && { endingDay: true }),
        };
        currentDate = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1))
          .toISOString()
          .split("T")[0];
      }
      newSelectedDates = { ...newSelectedDates, ...markedDates };
      setEndDay(day.dateString);
    }

    setSelectedDates(newSelectedDates);
  };

  const renderHeader = (date) => {
    const year = date?.getFullYear() || "";
    const month = date ? date.getMonth() + 1 : "";
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{`${year} ${month}월`}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.calendarContainer, style]}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        markingType={"period"}
        theme={{
          backgroundColor: colors.calendarColor,
          calendarBackground: colors.calendarColor,
          dayTextColor: colors.black,
          textDisabledColor: colors.gray,
          selectedDayBackgroundColor: colors.buttonAfterColor,
          selectedDayTextColor: colors.white,
          arrowColor: colors.black,
          monthTextColor: colors.black,
          textSectionTitleColor: colors.black,
        }}
        style={styles.calendar}
        locale={"ko"}
        renderHeader={customHeader || renderHeader}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[styles.footerText, styles.footerTextReset]}>초기화</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={[styles.footerText, styles.footerTextComplete]}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: "90%",
    height: 370,
    paddingHorizontal: 10,
    backgroundColor: colors.calendarColor,
    borderRadius: 15,
    padding: 10,
  },
  calendar: {
    padding: 3,
  },
  header: {
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 13,
    color: colors.buttonAfterColor,
  },
  footerTextReset: {
    color: colors.black,
  },
});

export default CalendarPicker;