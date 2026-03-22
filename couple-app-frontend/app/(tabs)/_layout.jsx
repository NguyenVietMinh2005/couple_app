import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#ff4d6d', // Màu hồng đậm khi được chọn
      headerShown: true // Hiện tiêu đề ở cạnh trên màn hình
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kỷ niệm',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Nhắn tin',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
        }}
      />
    </Tabs>
  );
}