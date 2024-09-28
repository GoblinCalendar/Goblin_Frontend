import React, { createContext, useState } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventDetails, setEventDetails] = useState({
    name: '',
    duration: '',
    dates: [],
    startTime: '',
    endTime: '',
    participants: [],
    place: null,
  });

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails }}>
      {children}
    </EventContext.Provider>
  );
};
