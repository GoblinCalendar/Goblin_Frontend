import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'gooblin.shop',
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 전처리
apiClient.interceptors.request.use(
  config => {
    // 예: 토큰 추가
    const token = AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 전처리
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 에러 핸들링 (예: 인증 만료 시 로그아웃 처리 등)
    return Promise.reject(error);
  }
);

export default apiClient;
