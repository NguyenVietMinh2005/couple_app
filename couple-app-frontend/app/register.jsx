import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../src/api/axiosClient'; 

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Kiểm tra lọt khe các trường hợp bỏ trống
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    // 2. Kiểm tra mật khẩu có khớp nhau không
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setIsLoading(true);
      
      // 3. Gửi thông tin lên hệ thống Backend
      const response = await axiosClient.post('/auth/register', {
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });

      // 4. Nếu đăng ký thành công và Server trả về token, cho đăng nhập luôn
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        Alert.alert('Thành công', 'Chào mừng bạn đến với Couple App! 🎉');
        router.replace('/(tabs)');
      } else {
        // Nếu Server chỉ báo thành công mà không kèm token, đẩy về trang Login
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        router.replace('/login');
      }

    } catch (error) {
      console.log("LỖI ĐĂNG KÝ:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản!';
      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Nút Quay lại */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản mới ✨</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình lưu giữ kỷ niệm tình yêu</Text>
          </View>

          <View style={styles.form}>
            {/* Ô nhập Tên hiển thị */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Tên của bạn"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Ô nhập Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email đăng nhập"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Ô nhập Mật khẩu */}
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

            {/* Ô Xác nhận Mật khẩu */}
            <View style={styles.inputContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity 
              style={styles.registerBtn}
              onPress={handleRegister} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Đăng ký tài khoản</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Chuyển về trang Đăng nhập */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 10, padding: 10 },
  header: { marginBottom: 30, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 16,
    paddingHorizontal: 16, height: 60, marginBottom: 16
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  registerBtn: {
    backgroundColor: '#ff4d6d', borderRadius: 16,
    height: 60, justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: '#ff4d6d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  registerBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 20 },
  footerText: { color: '#666', fontSize: 15 },
  loginText: { color: '#ff4d6d', fontSize: 15, fontWeight: 'bold' }
});