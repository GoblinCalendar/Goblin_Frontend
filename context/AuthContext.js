import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);  // null로 초기화

  // 앱이 실행될 때 로그인 상태를 AsyncStorage에서 가져오기
  useEffect(() => {
    const loadLoginState = async () => {
      const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
      if (storedLoginState === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    loadLoginState();
  }, []);

  // 로그인 함수
  const login = async () => {
    setIsLoggedIn(true);
    await AsyncStorage.setItem('isLoggedIn', 'true'); // AsyncStorage에 로그인 상태 저장
  };

  // 로그아웃 함수
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('isLoggedIn'); // AsyncStorage에서 로그인 상태 제거
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
