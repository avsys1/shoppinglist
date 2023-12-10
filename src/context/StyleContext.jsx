import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
const StyleContext = createContext();
export const StyleProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState("dark");
  return (
    <StyleContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => {
  return useContext(StyleContext);
};
