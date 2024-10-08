import { StyleSheet, TouchableOpacity, View } from "react-native";

import Pencil from "../assets/pencil.svg";
import Trash from "../assets/trash.svg";

export const SwipeListButton = ({ style, data, rowMap, onEditPress, onDeletePress }) => (
  <View style={[styles.sideButtonWrapper, style]}>
    <TouchableOpacity
      style={[
        styles.sideButton,
        {
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: "#7BB872",
        },
      ]}
      onPress={onEditPress}
    >
      <Pencil />
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.sideButton,
        {
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: "#DE5E56",
        },
      ]}
      onPress={onDeletePress}
    >
      <Trash />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  sideButtonWrapper: {
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
