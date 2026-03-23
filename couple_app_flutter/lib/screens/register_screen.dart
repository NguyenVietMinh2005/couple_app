import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_client.dart';
import 'login_screen.dart'; // Để điều hướng về trang đăng nhập

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  bool _showPassword = false;
  bool _isLoading = false;

  Future<void> _handleRegister() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    // 1. Kiểm tra bỏ trống
    if (name.isEmpty || email.isEmpty || password.isEmpty || confirmPassword.isEmpty) {
      _showMessage('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    // 2. Kiểm tra mật khẩu khớp nhau
    if (password != confirmPassword) {
      _showMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    setState(() { _isLoading = true; });

    try {
      // 3. Gọi API lên Backend Node.js
      final response = await ApiClient.dio.post('/auth/register', data: {
        'fullName': name,
        'email': email,
        'password': password,
      });

      // 4. Xử lý sau khi thành công
      if (response.data['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userToken', response.data['token']);
        _showMessage('Chào mừng bạn đến với Couple App! 🎉', isSuccess: true);
        // TODO: Điều hướng sang trang chủ (Tabs)
      } else {
        _showMessage('Đăng ký thành công! Vui lòng đăng nhập.', isSuccess: true);
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const LoginScreen()),
          );
        }
      }
    } on DioException catch (e) {
      print("LỖI ĐĂNG KÝ: ${e.response?.data ?? e.message}");
      final message = e.response?.data['message'] ?? 'Có lỗi xảy ra khi tạo tài khoản!';
      _showMessage(message);
    } finally {
      setState(() { _isLoading = false; });
    }
  }

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
      // Dùng AppBar trong suốt để làm nút Quay lại đẹp mắt
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF333333)),
          onPressed: () => Navigator.pop(context), // Lệnh quay lại màn hình trước
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500), // Giữ giao diện gọn gàng trên Web
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // --- HEADER ---
                  const Text(
                    'Tạo tài khoản mới ✨',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF333333)),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Bắt đầu hành trình lưu giữ kỷ niệm tình yêu',
                    style: TextStyle(fontSize: 16, color: Color(0xFF666666)),
                  ),
                  const SizedBox(height: 30),

                  // --- FORM NHẬP LIỆU ---
                  // Ô nhập Tên
                  _buildTextField(
                    controller: _nameController,
                    hint: 'Tên của bạn',
                    icon: Icons.person_outline,
                  ),
                  const SizedBox(height: 16),

                  // Ô nhập Email
                  _buildTextField(
                    controller: _emailController,
                    hint: 'Email đăng nhập',
                    icon: Icons.mail_outline,
                    type: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),

                  // Ô nhập Mật khẩu
                  _buildPasswordField(
                    controller: _passwordController,
                    hint: 'Mật khẩu',
                  ),
                  const SizedBox(height: 16),

                  // Ô Xác nhận Mật khẩu
                  _buildPasswordField(
                    controller: _confirmPasswordController,
                    hint: 'Xác nhận mật khẩu',
                  ),
                  const SizedBox(height: 30),

                  // Nút Đăng ký
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleRegister,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF4D6D),
                      disabledBackgroundColor: const Color(0xFFFF4D6D).withOpacity(0.7),
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 5,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 24, width: 24,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                          )
                        : const Text('Đăng ký tài khoản', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 20),

                  // --- FOOTER ---
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Đã có tài khoản? ', style: TextStyle(color: Color(0xFF666666), fontSize: 15)),
                      GestureDetector(
                        onTap: () {
                          // Điều hướng sang thay thế bằng trang Đăng nhập
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginScreen()),
                          );
                        },
                        child: const Text('Đăng nhập', style: TextStyle(color: Color(0xFFFF4D6D), fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Hàm tiện ích để vẽ các ô text rút gọn code
  Widget _buildTextField({required TextEditingController controller, required String hint, required IconData icon, TextInputType type = TextInputType.text}) {
    return Container(
      decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(16)),
      child: TextField(
        controller: controller, keyboardType: type,
        decoration: InputDecoration(
          hintText: hint, hintStyle: const TextStyle(color: Color(0xFFAAAAAA)),
          prefixIcon: Icon(icon, color: const Color(0xFF888888)),
          border: InputBorder.none, contentPadding: const EdgeInsets.symmetric(vertical: 20),
        ),
      ),
    );
  }

  Widget _buildPasswordField({required TextEditingController controller, required String hint}) {
    return Container(
      decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(16)),
      child: TextField(
        controller: controller, obscureText: !_showPassword,
        decoration: InputDecoration(
          hintText: hint, hintStyle: const TextStyle(color: Color(0xFFAAAAAA)),
          prefixIcon: const Icon(Icons.lock_outline, color: const Color(0xFF888888)),
          suffixIcon: IconButton(
            icon: Icon(_showPassword ? Icons.visibility : Icons.visibility_off, color: const Color(0xFF888888)),
            onPressed: () => setState(() => _showPassword = !_showPassword),
          ),
          border: InputBorder.none, contentPadding: const EdgeInsets.symmetric(vertical: 20),
        ),
      ),
    );
  }
}