import { Redirect } from 'expo-router';

export default function Index() {
  // Khi app vừa khởi động ở đường dẫn gốc, ngay lập tức bẻ lái sang trang Đăng nhập
  return <Redirect href="/login" />;
}