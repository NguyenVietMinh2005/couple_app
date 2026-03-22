import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Đặt initialRouteName là 'login' để app bật lên là thấy màn hình đăng nhập luôn
    <Stack initialRouteName="login">
      {/* Khai báo màn hình Login (ẩn tiêu đề) */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      
      {/* Khai báo khu vực Tabs (ẩn tiêu đề) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}