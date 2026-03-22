import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lắp đường link Render xịn xò của bạn vào đây
const axiosClient = axios.create({
  baseURL: 'https://couple-app-wz33.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm "bảo vệ" trước khi gửi request đi (Tự động gắn Token)
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;