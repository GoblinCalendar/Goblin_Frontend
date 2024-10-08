import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
