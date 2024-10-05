import { useEffect, useState } from "react";
import { Animated, Easing, TouchableWithoutFeedback } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ToggleButton = ({ active, onPress, containerStyle, buttonStyle }) => {
  const [animatedValue] = useState(new Animated.Value(active ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [active, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 16],
  });

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          buttonStyle,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};
