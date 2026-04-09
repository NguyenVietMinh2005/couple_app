import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_client.dart'; // Đảm bảo bạn đã tạo file này ở bước trước
import 'register_screen.dart';
import 'forgot_password_screen.dart';
import 'main_tab_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _showPassword = false;
  bool _isLoading = false;

  // Hàm xử lý Đăng nhập gọi API
  Future<void> _handleLogin() async {
    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _showMessage('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Gọi API Backend Node.js của bạn
      final response = await ApiClient.dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      // Lưu Token vào máy
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userToken', response.data['token']);

      _showMessage('Đăng nhập thành công! 🎉', isSuccess: true);
      
      if (mounted) {
        Navigator.pushReplacement(
          context,
          // SỬA CHỮ HomeScreen() THÀNH MainTabScreen() Ở DÒNG DƯỚI ĐÂY:
          MaterialPageRoute(builder: (context) => const MainTabScreen()),
        );
      
}
    } on DioException catch (e) {
      print("CHI TIẾT LỖI ĐĂNG NHẬP: ${e.response?.data ?? e.message}");
      final message =
          e.response?.data['message'] ??
          'Có lỗi xảy ra, không thể kết nối tới máy chủ!';
      _showMessage(message);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Hàm chờ xử lý Facebook
  void _handleFacebookLogin() {
    _showMessage('Tính năng kết nối Facebook SDK đang được hoàn thiện!');
  }

  // Hàm hiển thị thông báo (thay thế cho Alert.alert của React Native)
  void _showMessage(String message, {bool isSuccess = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? Colors.green : Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // --- PHẦN HEADER ---
                  const Text(
                    'Chào mừng trở lại! 👋',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Đăng nhập để kết nối với nửa kia của bạn',
                    style: TextStyle(fontSize: 16, color: Color(0xFF666666)),
                  ),
                  const SizedBox(height: 40),

                  // --- FORM NHẬP LIỆU ---
                  // Ô nhập Email
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        hintText: 'Email của bạn',
                        hintStyle: TextStyle(color: Color(0xFFAAAAAA)),
                        prefixIcon: Icon(
                          Icons.mail_outline,
                          color: Color(0xFF888888),
                        ),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 20),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Ô nhập Mật khẩu
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: TextField(
                      controller: _passwordController,
                      obscureText: !_showPassword,
                      decoration: InputDecoration(
                        hintText: 'Mật khẩu',
                        hintStyle: const TextStyle(color: Color(0xFFAAAAAA)),
                        prefixIcon: const Icon(
                          Icons.lock_outline,
                          color: Color(0xFF888888),
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _showPassword
                                ? Icons.visibility
                                : Icons.visibility_off,
                            color: const Color(0xFF888888),
                          ),
                          onPressed: () {
                            setState(() {
                              _showPassword = !_showPassword;
                            });
                          },
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 20,
                        ),
                      ),
                    ),
                  ),

                  // Quên mật khẩu
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ForgotPasswordScreen(),
                          ),
                        );
                      },
                      child: const Text(
                        'Quên mật khẩu?',
                        style: TextStyle(
                          color: Color(0xFFFF4D6D),
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Nút Đăng nhập
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF4D6D),
                      disabledBackgroundColor: const Color(
                        0xFFFF4D6D,
                      ).withOpacity(0.7),
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 5,
                      shadowColor: const Color(0xFFFF4D6D).withOpacity(0.5),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 3,
                            ),
                          )
                        : const Text(
                            'Đăng nhập',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                  const SizedBox(height: 30),

                  // --- HOẶC TIẾP TỤC VỚI ---
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 1,
                          color: const Color(0xFFEEEEEE),
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          'Hoặc tiếp tục với',
                          style: TextStyle(
                            color: Color(0xFF888888),
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Container(
                          height: 1,
                          color: const Color(0xFFEEEEEE),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Nút Facebook
                  ElevatedButton.icon(
                    onPressed: _handleFacebookLogin,
                    icon: const Icon(
                      Icons.facebook,
                      color: Colors.white,
                      size: 24,
                    ),
                    label: const Text(
                      'Đăng nhập bằng Facebook',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1877F2),
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 5,
                      shadowColor: const Color(0xFF1877F2).withOpacity(0.5),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // --- FOOTER ---
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Chưa có tài khoản? ',
                        style: TextStyle(
                          color: Color(0xFF666666),
                          fontSize: 15,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const RegisterScreen(),
                            ),
                          );
                        },
                        child: const Text(
                          'Đăng ký ngay',
                          style: TextStyle(
                            color: Color(0xFFFF4D6D),
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
