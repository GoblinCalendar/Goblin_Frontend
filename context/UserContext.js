import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [personalGroupId, setPersonalGroupId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // 앱이 처음 실행될 때 AsyncStorage에서 값을 불러옴
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const keys = ["groupId", "personalGroupId", "userId", "username", "userRole"];
        const results = await AsyncStorage.multiGet(keys);

        const [
          [, storedGroupId],
          [, storedPersonalGroupId],
          [, storedUserId],
          [, storedUsername],
          [, storedUserRole],
        ] = results;

        setPersonalGroupId(storedPersonalGroupId);
        setGroupId(storedPersonalGroupId); //개인 캘린더로 시작
        setGroupName(`${storedUsername}님의 캘린더`);

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
        personalGroupId,
        groupId,
        setGroupId,
        groupName,
        setGroupName,
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
