import 'package:flutter/material.dart';
// 1. Thêm dòng này để gọi file giao diện Đăng nhập
 
import 'screens/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Couple App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.pink),
        useMaterial3: true,
      ),
      // 2. Thay nguyên cục Scaffold cũ bằng LoginScreen
      home: const SplashScreen(),
    );
  }
}