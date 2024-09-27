import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const BackButton = ({ navigateTo }) => {
  const router = useRouter();

  const handlePress = () => {
    if (navigateTo) {
      router.replace(navigateTo);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handlePress}
    >
      <Svg width={30} height={30} viewBox="0 0 24 24">
        <Path
          d="M15 6l-6 6 6 6"
          stroke="#111"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60, 
    left: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default BackButton;
