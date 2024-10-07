import { createDrawerNavigator } from "@react-navigation/drawer";
import { SidebarDrawer } from "./SidebarDrawer";

export const DrawerWrapper = ({ screen }) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="screen"
      drawerContent={({ navigation }) => <SidebarDrawer navigation={navigation} />}
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
