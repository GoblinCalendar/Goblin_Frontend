import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const TimeDragBar = ({ style }) => {
  return (
    <View style={[styles.outerShape, style]} >
        <View style={styles.innerShape} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerShape: {
    width: 41,
    height: 9,
    backgroundColor: colors.buttonAfterColor,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
  },
  innerShape: {
    width: 21,
    height: 1,
    backgroundColor: colors.white,
    borderRadius: 2,
    position: 'absolute',
    top: 4,
  },
});

export default TimeDragBar;
