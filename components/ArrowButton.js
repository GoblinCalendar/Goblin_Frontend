import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import colors from '../styles/colors';

const CustomArrowButton = ({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      <Svg height="12" width="32" viewBox="0 0 32 12">
        <Polygon
          points="13,7.5 16,4.5 19,7.5"
          fill={colors.buttonAfterColor}
          stroke={colors.buttonAfterColor}
          strokeWidth="1"
          strokeLinejoin="round"  // 둥근 모서리를 적용하는 속성
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 44,
    height: 12,
    backgroundColor: colors.calendarColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomArrowButton;
