import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router";
import { useLang } from "../context/LangContext";
import axios from "axios";
import { useStyle } from "../context/StyleContext";
/**
 * Header stránky
 */
function Header({ onClick }) {
  const { texts, lang, setLang } = useLang();
  const { currentMode, setCurrentMode } = useStyle();
  const navigate = useNavigate();
  const [dataFromRequest, setDataFromRequest] = useState();

  function changeUser(value) {
    localStorage.setItem("loggedUser", JSON.stringify(value));
    if (onClick) onClick();
    navigate("/");
  }

  async function getData() {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/list")
        .then((response) => {
          setDataFromRequest(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <nav
      className={
        "navbar navbar-expand-lg navbar-" +
        currentMode +
        " bg-" +
        currentMode +
        " text-" +
        (currentMode == "light" ? "dark" : "light")
      }
    >
      {dataFromRequest?.map((zaznam) => (
        <button
          className={"btn btn-" + currentMode}
          onClick={(e) => changeUser(zaznam.id)}
        >
          {zaznam.name}
        </button>
      ))}
      <div id="lang">
        <p className="nav-lang">Jazyk: {lang}</p>
        <button className="nav-lang-button" onClick={() => setLang("cs")}>
          Čeština
        </button>
        <button className="nav-lang-button" onClick={() => setLang("en")}>
          English
        </button>
      </div>
      <div>
        <p className="nav-lang">Aktuální mód: {currentMode}</p>
        <button
          className="nav-lang-button"
          onClick={() => setCurrentMode("dark")}
        >
          {texts.darkmode}
        </button>
        <button
          className="nav-lang-button"
          onClick={() => setCurrentMode("light")}
        >
          {texts.lightmode}
        </button>
      </div>
    </nav>
  );
}

export default Header;
