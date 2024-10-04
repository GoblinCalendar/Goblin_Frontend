import React, { createContext, useState } from 'react';

// Notification Context 생성
export const NotificationContext = createContext();

// Provider 컴포넌트 생성
export const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);

  // 알림을 보여주기 위한 함수
  const triggerNotification = () => {
    setShowNotification(true);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, triggerNotification , setShowNotification}}>
      {children}
    </NotificationContext.Provider>
  );
};
