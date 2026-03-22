import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axiosClient from '../src/api/axiosClient';

export default function ForgotPasswordScreen() {
  // Trạng thái điều hướng: 1 = Nhập Email, 2 = Nhập OTP & Pass mới
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Gọi API Gửi mã OTP
  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email đăng ký của bạn!');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosClient.post('/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });
      Alert.alert('Thành công', response.data.message);
      setStep(2); // Chuyển sang form nhập OTP
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể kết nối tới máy chủ!';
      Alert.alert('Lỗi', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!otpCode || !newPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosClient.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otpCode: otpCode.trim(),
        newPassword: newPassword
      });
      
      Alert.alert('Tuyệt vời', response.data.message, [
        { text: 'Đăng nhập ngay', onPress: () => router.replace('/login') }
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'Mã OTP không hợp lệ!';
      Alert.alert('Lỗi', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Khôi phục Mật khẩu 🔐</Text>
          <Text style={styles.subtitle}>
            {step === 1 
              ? 'Nhập email của bạn để nhận mã xác minh (OTP)' 
              : `Mã xác minh đã được gửi đến ${email}`}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Bước 1: Chỉ hiện ô nhập Email */}
          {step === 1 && (
            <>
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

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleSendOTP} 
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Gửi mã OTP</Text>}
              </TouchableOpacity>
            </>
          )}

          {/* Bước 2: Hiện ô nhập OTP và Mật khẩu mới */}
          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mã OTP (6 số)"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu mới"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleResetPassword} 
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Đổi mật khẩu</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 24, paddingTop: 60 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  header: { marginBottom: 30, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22 },
  form: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 16,
    paddingHorizontal: 16, height: 60, marginBottom: 16
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  actionButton: {
    backgroundColor: '#ff4d6d', borderRadius: 16,
    height: 60, justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: '#ff4d6d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});