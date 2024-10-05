import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from 'expo-router';

export default function New() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/createEventHostView/eventName');
  }, []);

  return <View></View>;
}