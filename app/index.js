import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View>
      <Text>Main 화면-</Text>
      <Button
        title="이벤트 생성 화면으로 이동"
        onPress={() => router.push('/createEventHostView/eventName')}
      />
      <Button
        title="이벤트 시간 화면으로 이동"
        onPress={() => router.push('/createEventHostView/eventTime')}
      />
      <Button
        title="이벤트 날짜 화면으로 이동"
        onPress={() => router.push('/createEventHostView/eventDate')}
      />
    </View>
  );
}
