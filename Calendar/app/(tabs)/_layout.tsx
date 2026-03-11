import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />   {/* 시작 화면(용) */}
      <Stack.Screen name="login" />   {/* 로그인 입력창 */}
      <Stack.Screen name="signup" />  {/* 회원가입 창 (추가!) */}
      <Stack.Screen name="(tabs)" />  {/* 메인 달력 */}
    </Stack>
  );
}