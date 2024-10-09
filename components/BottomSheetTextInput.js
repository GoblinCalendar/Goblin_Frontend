import { useMemo } from "react";
import { TextInput } from "react-native";

export const BottomSheetTextInput = ({ value, ...props }) =>
  useMemo(() => <TextInput {...props} />, [value]);
