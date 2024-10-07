import { createContext, useState } from "react";

export const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const [groupId, setGroupId] = useState(null);

  return <GroupContext.Provider value={{ groupId, setGroupId }}>{children}</GroupContext.Provider>;
};
