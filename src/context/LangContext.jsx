import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
const LangContext = createContext();
export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState({});
  useEffect(() => {
    axios.get("/lang/" + lang + ".json").then((response) => {
      setTexts(response.data);
    });
  }, lang);
  return (
    <LangContext.Provider value={{ lang, setLang, texts, setTexts }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  return useContext(LangContext);
};
