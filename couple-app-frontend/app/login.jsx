import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
// Thêm FontAwesome5 để lấy logo Facebook chuẩn xác nhất
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../src/api/axiosClient'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosClient.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password
      });

      await AsyncStorage.setItem('userToken', response.data.token);
      router.replace('/(tabs)');
    } catch (error) {
        console.log("CHI TIẾT LỖI ĐĂNG NHẬP:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Có lỗi xảy ra, không thể kết nối tới máy chủ!';
      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm chờ xử lý Đăng nhập Facebook
  const handleFacebookLogin = () => {
    Alert.alert('Thông báo', 'Tính năng kết nối Facebook SDK đang được hoàn thiện!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Chào mừng trở lại! 👋</Text>
          <Text style={styles.subtitle}>Đăng nhập để kết nối với nửa kia của bạn</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email của bạn"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
  <Text style={styles.forgotText}>Quên mật khẩu?</Text>
</TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- KHU VỰC ĐĂNG NHẬP FACEBOOK --- */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.fbButton} onPress={handleFacebookLogin}>
          <FontAwesome5 name="facebook" size={24} color="#fff" style={styles.fbIcon} />
          <Text style={styles.fbButtonText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>
        {/* ----------------------------------- */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { marginBottom: 20 }, // Giảm margin để nhường chỗ cho nút FB
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 16,
    paddingHorizontal: 16, height: 60, marginBottom: 16
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#ff4d6d', fontSize: 14, fontWeight: '600' },
  loginButton: {
    backgroundColor: '#ff4d6d', borderRadius: 16,
    height: 60, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#ff4d6d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  /* Style mới cho Divider và Nút Facebook */
  dividerContainer: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20
  },
  dividerLine: {
    flex: 1, height: 1, backgroundColor: '#eee'
  },
  dividerText: {
    marginHorizontal: 10, color: '#888', fontSize: 14
  },
  fbButton: {
    flexDirection: 'row', backgroundColor: '#1877F2', borderRadius: 16,
    height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    shadowColor: '#1877F2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  fbIcon: { marginRight: 10 },
  fbButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { color: '#666', fontSize: 15 },
  registerText: { color: '#ff4d6d', fontSize: 15, fontWeight: 'bold' }
});