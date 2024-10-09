import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // 앱이 처음 실행될 때 AsyncStorage에서 값을 불러옴
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedGroupId = await AsyncStorage.getItem("groupId");
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUsername = await AsyncStorage.getItem("username");
        const storedUserRole = await AsyncStorage.getItem("userRole");

        if (storedGroupId) setGroupId(storedGroupId);
        if (storedUserId) setUserId(storedUserId);
        if (storedUsername) setUsername(storedUsername);
        if (storedUserRole) setUserRole(storedUserRole);
      } catch (error) {
        console.error("AsyncStorage에서 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        groupId,
        setGroupId,
        userId,
        setUserId,
        username,
        setUsername,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
