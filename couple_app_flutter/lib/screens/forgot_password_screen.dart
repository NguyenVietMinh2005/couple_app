import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../api/api_client.dart';
import 'login_screen.dart'; 

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  // Trạng thái điều hướng: 1 = Nhập Email, 2 = Nhập OTP & Pass mới
  int _step = 1;

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();

  bool _showPassword = false;
  bool _isLoading = false;

  // Gọi API Gửi mã OTP
  Future<void> _handleSendOTP() async {
    final email = _emailController.text.trim().toLowerCase();
    
    if (email.isEmpty) {
      _showMessage('Vui lòng nhập email đăng ký của bạn!');
      return;
    }

    setState(() { _isLoading = true; });

    try {
      final response = await ApiClient.dio.post('/auth/forgot-password', data: {
        'email': email,
      });

      _showMessage(response.data['message'] ?? 'Đã gửi mã OTP!', isSuccess: true);
      setState(() { _step = 2; }); // Chuyển sang form nhập OTP

    } on DioException catch (e) {
      final message = e.response?.data['message'] ?? 'Không thể kết nối tới máy chủ!';
      _showMessage(message);
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  // Gọi API Đặt lại mật khẩu
  Future<void> _handleResetPassword() async {
    final email = _emailController.text.trim().toLowerCase();
    final otpCode = _otpController.text.trim();
    final newPassword = _newPasswordController.text;

    if (otpCode.isEmpty || newPassword.isEmpty) {
      _showMessage('Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!');
      return;
    }

    setState(() { _isLoading = true; });

    try {
      final response = await ApiClient.dio.post('/auth/reset-password', data: {
        'email': email,
        'otpCode': otpCode,
        'newPassword': newPassword,
      });

      _showMessage(response.data['message'] ?? 'Đổi mật khẩu thành công!', isSuccess: true);
      
      // Chuyển về trang Đăng nhập
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
          (route) => false, // Xóa hết lịch sử trang để không back lại được nữa
        );
      }
    } on DioException catch (e) {
      final message = e.response?.data['message'] ?? 'Mã OTP không hợp lệ!';
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
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF333333)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // --- HEADER ---
                  const Text(
                    'Khôi phục Mật khẩu 🔐',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF333333)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _step == 1 
                        ? 'Nhập email của bạn để nhận mã xác minh (OTP)'
                        : 'Mã xác minh đã được gửi đến ${_emailController.text}',
                    style: const TextStyle(fontSize: 15, color: Color(0xFF666666), height: 1.5),
                  ),
                  const SizedBox(height: 30),

                  // --- BƯỚC 1: NHẬP EMAIL ---
                  if (_step == 1) ...[
                    _buildTextField(
                      controller: _emailController,
                      hint: 'Email của bạn',
                      icon: Icons.mail_outline,
                      type: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 24),
                    _buildActionButton(
                      text: 'Gửi mã OTP',
                      onPressed: _isLoading ? null : _handleSendOTP,
                    ),
                  ],

                  // --- BƯỚC 2: NHẬP OTP & PASS MỚI ---
                  if (_step == 2) ...[
                    _buildTextField(
                      controller: _otpController,
                      hint: 'Nhập mã OTP (6 số)',
                      icon: Icons.dialpad,
                      type: TextInputType.number,
                      maxLength: 6,
                    ),
                    const SizedBox(height: 16),
                    _buildPasswordField(),
                    const SizedBox(height: 24),
                    _buildActionButton(
                      text: 'Đổi mật khẩu',
                      onPressed: _isLoading ? null : _handleResetPassword,
                    ),
                  ],
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({required TextEditingController controller, required String hint, required IconData icon, required TextInputType type, int? maxLength}) {
    return Container(
      decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(16)),
      child: TextField(
        controller: controller,
        keyboardType: type,
        maxLength: maxLength,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Color(0xFFAAAAAA)),
          prefixIcon: Icon(icon, color: const Color(0xFF888888)),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 20),
          counterText: "", // Ẩn chữ đếm số ký tự ở góc dưới ô OTP
        ),
      ),
    );
  }

  Widget _buildPasswordField() {
    return Container(
      decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(16)),
      child: TextField(
        controller: _newPasswordController,
        obscureText: !_showPassword,
        decoration: InputDecoration(
          hintText: 'Mật khẩu mới',
          hintStyle: const TextStyle(color: Color(0xFFAAAAAA)),
          prefixIcon: const Icon(Icons.lock_outline, color: const Color(0xFF888888)),
          suffixIcon: IconButton(
            icon: Icon(_showPassword ? Icons.visibility : Icons.visibility_off, color: const Color(0xFF888888)),
            onPressed: () => setState(() => _showPassword = !_showPassword),
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 20),
        ),
      ),
    );
  }

  Widget _buildActionButton({required String text, required VoidCallback? onPressed}) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFFFF4D6D),
        disabledBackgroundColor: const Color(0xFFFF4D6D).withOpacity(0.7),
        padding: const EdgeInsets.symmetric(vertical: 18),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 5,
      ),
      child: _isLoading
          ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3))
          : Text(text, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
    );
  }
}