import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://gooblin.shop',
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 전처리
apiClient.interceptors.request.use(
  async config => {
    // 회원가입 경로일 경우 Authorization 헤더를 추가하지 않음
    if (config.url !== '/api/users/register') {
      // 비동기적으로 토큰 가져오기
      const token = await AsyncStorage.getItem('accessToken');
      console.log('저장된 Access Token:', token); // 기존에 저장된 토큰 로그 찍기
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    console.error('요청 전처리 중 오류 발생:', error); // 오류 로그
    return Promise.reject(error);
  }
);

// 응답 전처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료 시 처리 (401 또는 403 에러)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      try {
        // 토큰 갱신 시도
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // 새로 받은 Access Token으로 요청 다시 시도
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
        // 로그아웃 처리 또는 사용자에게 알림 후 무한 루프 방지
        // 로그아웃 처리 예시:
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // 다른 로그아웃 처리 또는 로그인 페이지로 이동
        // router.push('/login'); // 예시로 로그인 페이지로 이동
      }
    }
    return Promise.reject(error);
  }
);

// Refresh Token으로 Access Token 재발급
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const loginId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');
    const userRole = await AsyncStorage.getItem('userRole');

    console.log('리프레시 토큰:', refreshToken); // 리프레시 토큰 확인
    console.log('로그인 ID:', loginId); // 로그인 ID 확인
    console.log('유저 이름:', username); // 유저 이름 확인
    console.log('userRole:', userRole);

    if (!refreshToken || !loginId || !username || !userRole) {
      throw new Error('필요한 정보가 부족합니다.');
    }

    const response = await apiClient.post('/api/users/refresh-token', {
      loginId: loginId,
      username: username,
      refreshToken: refreshToken,
      userRole: userRole,
    });

    const { accessToken } = response.data;

    await AsyncStorage.setItem('accessToken', accessToken); // 새로 받은 accessToken 저장
    return accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error; // refresh token 갱신 실패 시 에러 처리
  }
};

export default apiClient;
