import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart';
import 'main_tab_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkLoginStatus(); // Kích hoạt kiểm tra ngay khi mở màn hình
  }

  Future<void> _checkLoginStatus() async {
    // Ép app chờ 2 giây để người dùng kịp ngắm logo (bạn có thể bỏ dòng này sau này nếu muốn nhanh)
    await Future.delayed(const Duration(seconds: 2));

    // Lục tìm Token
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken');

    if (!mounted) return;

    if (token != null && token.isNotEmpty) {
      // Đã có Token -> Bắn thẳng vào Trang Chủ (MainTabScreen)
      Navigator.pushReplacement(
        context,
        // SỬA CHỮ HomeScreen() THÀNH MainTabScreen() Ở DÒNG DƯỚI ĐÂY:
        MaterialPageRoute(builder: (context) => const MainTabScreen()),
      );
    
    } else {
      // Chưa có Token -> Đẩy ra cổng Đăng nhập
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFFF4D6D), // Màu nền hồng chủ đạo
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.favorite, size: 100, color: Colors.white), // Thay bằng Logo của bạn sau
            SizedBox(height: 20),
            Text(
              'Couple App',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            SizedBox(height: 30),
            CircularProgressIndicator(color: Colors.white), // Vòng tròn xoay xoay tải dữ liệu
          ],
        ),
      ),
    );
  }
}