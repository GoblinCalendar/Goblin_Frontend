import { createDrawerNavigator } from "@react-navigation/drawer";
import { SidebarDrawer } from "./SidebarDrawer";
import { useCallback } from "react";

export const DrawerWrapper = ({ screen }) => {
  const Drawer = createDrawerNavigator();

  // Memoize the drawer content to avoid unnecessary re-renders
  const renderDrawerContent = useCallback(
    ({ navigation }) => <SidebarDrawer navigation={navigation} />,
    []
  );

  return (
    <Drawer.Navigator
      initialRouteName="screen"
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        drawerType: "front",
        swipeEnabled: false,
        overlayColor: "transparent",
        drawerStyle: {
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          borderColor: "#CEE7F3",
          borderWidth: 1,
          shadowColor: "black",
          shadowOffset: {
            height: 0,
            width: 4,
          },
          shadowRadius: 4,
          shadowOpacity: 0.04,
        },
      }}
    >
      <Drawer.Screen name="screen">{screen}</Drawer.Screen>
    </Drawer.Navigator>
  );
};
