import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  // Lắp đường link Render xịn xò của Backend vào đây
  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://couple-app-wz33.onrender.com/api',
      connectTimeout: const Duration(seconds: 30), // Bắt App kiên nhẫn đợi 30s
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  )..interceptors.add(
      InterceptorsWrapper(
        // Hành động tự động gắn Token trước khi gửi API đi
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('userToken');

          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options); 
        },
        onError: (DioException e, handler) {
          return handler.next(e);
        },
      ),
    );
}