import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const ButtonComponent = ({ title, style, isActive, onPress}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        style, 
        { backgroundColor: isActive ? colors.buttonAfterColor : colors.buttonBeforeColor }
      ]}
      onPress={isActive ? onPress : null}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: 335,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ButtonComponent;
