import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "https://gooblin.shop",
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 전처리
apiClient.interceptors.request.use(
  async (config) => {
    console.log(config.url);
    // 회원가입 경로일 경우 Authorization 헤더를 추가하지 않음
    if (config.url !== "/api/users/register" || config.url !== "/api/users/login") {
      // 비동기적으로 토큰 가져오기
      const token = await AsyncStorage.getItem("accessToken");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// 응답 전처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.error(error.config);

    // Access Token 만료 시 처리 (401 또는 403 에러)
    // if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //   try {
    //     // 토큰 갱신 시도
    //     const newAccessToken = await refreshAccessToken();

    //     // 발급받은 새 토큰으로 요청을 다시 시도
    //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //     return apiClient(originalRequest); // 요청을 다시 보냄
    //   } catch (err) {
    //     // 만약 refresh token 재발급 실패 시, 로그아웃 등의 처리
    //     console.error("토큰 갱신 실패:", err);
    //     // 로그아웃 처리 또는 로그인 페이지로 리다이렉트 가능
    //     // router.push('/login'); 예시로 로그아웃 처리 가능
    //   }
    // }

    return Promise.reject(error);
  }
);

// Refresh Token으로 Access Token 재발급
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const userId = await AsyncStorage.getItem("userId");
    const username = await AsyncStorage.getItem("username");
    const userRole = await AsyncStorage.getItem("userRole");

    const response = await apiClient.post("/api/users/refresh-token", {
      loginId: userId,
      username: username,
      refreshToken: refreshToken,
      userRole: userRole,
    });

    const { accessToken } = response.data;
    // 새롭게 받은 accessToken 저장
    await AsyncStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("토큰 갱신 실패:", error.message);
    console.error('Error details:', {
      message: error.message,
      config: error.config,
      code: error.code,
      status: error.response ? error.response.status : 'No response',
      data: error.response ? error.response.data : 'No data',
    });
    throw error; // refresh token 갱신 실패 시 에러를 던져서 처리할 수 있도록 함
  }
};

export default apiClient;
