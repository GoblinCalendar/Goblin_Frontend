import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function useAsyncStorage(name) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(name).then((result) => setValue(result));
  }, []);

  return [value, setValue];
}
