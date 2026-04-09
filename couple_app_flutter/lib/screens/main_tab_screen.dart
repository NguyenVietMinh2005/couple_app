import 'package:flutter/material.dart';
import 'home_screen.dart'; // Màn hình chủ fake ban nãy sẽ nằm ở đây

class MainTabScreen extends StatefulWidget {
  const MainTabScreen({super.key});

  @override
  State<MainTabScreen> createState() => _MainTabScreenState();
}

class _MainTabScreenState extends State<MainTabScreen> {
  int _currentIndex = 0;

  // Danh sách các màn hình (Tạm thời để trống 3 màn sau, chúng ta sẽ tạo dần)
  final List<Widget> _screens = [
    const HomeScreen(),
    const Center(child: Text('Màn hình Lịch kỷ niệm', style: TextStyle(fontSize: 20))),
    const Center(child: Text('Màn hình Nhắn tin', style: TextStyle(fontSize: 20))),
    const Center(child: Text('Màn hình Cá nhân', style: TextStyle(fontSize: 20))),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex], // Hiển thị màn hình tương ứng với tab được chọn
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed, // Giữ cố định các icon
        selectedItemColor: const Color(0xFFFF4D6D), // Màu hồng khi chọn
        unselectedItemColor: Colors.grey, // Màu xám khi không chọn
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Trang chủ'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_month), label: 'Kỷ niệm'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Tin nhắn'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Cá nhân'),
        ],
      ),
    );
  }
}