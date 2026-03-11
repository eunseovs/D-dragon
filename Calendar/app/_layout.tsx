import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. 시작 화면 */}
      <Stack.Screen name="index" />
      {/* 2. 로그인 입력창 */}
      <Stack.Screen name="login" />
      {/* 3. 회원가입 창  */}
      <Stack.Screen name="signup" />
      {/* 4. 메인 달력 그룹 */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}