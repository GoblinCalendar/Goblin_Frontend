import { Tabs } from "expo-router";
import colors from "../../styles/colors";

import MonthIcon from "../../assets/month_icon.svg";
import MonthOutlineIcon from "../../assets/month_outline_icon.svg";
import DayIcon from "../../assets/day_icon.svg";
import DayOutlineIcon from "../../assets/day_outline_icon.svg";
import TodoIcon from "../../assets/todo_icon.svg";
import TodoOutlineIcon from "../../assets/todo_outline_icon.svg";
import SearchIcon from "../../assets/search_icon.svg";
import SearchOutlineIcon from "../../assets/search_outline_icon.svg";
import PlusIcon from "../../assets/plus_icon.svg";
import PlusFocusedIcon from "../../assets/plus_focused_icon.svg";

import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function TabLayout() {
  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white }}
        edges={["top", "right", "left"]}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.skyBlue,
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="monthly"
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.menu}>
                  {focused ? <MonthIcon /> : <MonthOutlineIcon />}
                  <Text
                    style={[styles.text, { color: focused ? colors.skyBlue : colors.font04Gray }]}
                  >
                    월별
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="daily"
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.menu}>
                  {focused ? <DayIcon /> : <DayOutlineIcon />}
                  <Text
                    style={[styles.text, { color: focused ? colors.skyBlue : colors.font04Gray }]}
                  >
                    일별
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="new"
            options={{
              tabBarIcon: ({ focused }) => (focused ? <PlusFocusedIcon /> : <PlusIcon />),
            }}
          />
          <Tabs.Screen
            name="todo"
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.menu}>
                  {focused ? <TodoIcon /> : <TodoOutlineIcon />}
                  <Text
                    style={[styles.text, { color: focused ? colors.skyBlue : colors.font04Gray }]}
                  >
                    To Do
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.menu}>
                  {focused ? <SearchIcon /> : <SearchOutlineIcon />}
                  <Text
                    style={[styles.text, { color: focused ? colors.skyBlue : colors.font04Gray }]}
                  >
                    검색
                  </Text>
                </View>
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  menu: {
    paddingTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: -0.275,
  },
});
