import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text>main 화면</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
