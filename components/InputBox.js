import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const InputBox = ({ style, onChangeText, placeholder, maxLength}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (newText) => {
    // maxLength를 초과하지 않을 때만 상태를 업데이트
    if (newText.length <= maxLength) {
      setText(newText);
      onChangeText(newText); // 입력 변경 시 부모 컴포넌트에 전달
    }
  };

  return (
    <View View style={[styles.container, style, { borderBottomColor: isFocused ? colors.skyBlue : colors.lightGray }]}>
      <TextInput
        style={[
          styles.input, 
          { color: text || isFocused ? colors.black : colors.gray } // 입력 시 검정, 없을 시 회색
        ]}
        value={text}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        underlineColorAndroid="transparent" // Android에서 기본 underline 제거
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    width : 335,
    height : 40,
  },
  input: {
    fontSize: 16,
    borderWidth: 0,
    height: 20,
  },
});

export default InputBox;
