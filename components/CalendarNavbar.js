import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Drawer from "../assets/drawer.svg";
import People from "../assets/people.svg";
import colors from "../styles/colors";

import { TouchableOpacity } from "react-native-gesture-handler";

export default function CalendarNavbar({ title, currentMonth, onPress }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onPress}>
        <Drawer />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title || "???"}
      </Text>
      <View style={styles.indicators}>
        <TouchableOpacity onPress={() => router.push("/memberHostView")}>
          <People style={styles.people} />
        </TouchableOpacity>
        <View style={styles.monthIndicator}>
          <Text style={styles.monthIndicatorText}>{currentMonth || "?"}월</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 28,
    overflow: "hidden",
    color: "#484848",
  },
  people: {
    marginLeft: 20,
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  monthIndicator: {
    width: 27,
    alignItems: "center",
    marginLeft: 16,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  monthIndicatorText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.35,
    color: "#484848",
  },
});
