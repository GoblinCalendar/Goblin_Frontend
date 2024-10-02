import React, { createContext, useState } from 'react';

// Notification Context 생성
export const NotificationContext = createContext();

// Provider 컴포넌트 생성
export const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);

  // 알림을 보여주기 위한 함수
  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false); // 알림을 5초 후에 자동으로 끔
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, triggerNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
