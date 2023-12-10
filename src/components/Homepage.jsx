import "../css/global.css";
import Header from "./Header";
import { useEffect, useState } from "react";
import ListOfShoppingLists from "./ListOfShoppingLists";
import axios from "axios";
import { useStyle } from "../context/StyleContext";
/**
 * Komponent domácí stránky
 *
 * @returns
 */

function Homepage() {
  const [dataFromRequest, setDataFromRequest] = useState(null);
  const { currentMode } = useStyle();
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

  /* Při zapnutí stránky provede žádost o data ze serveru. Jakmile dostaneme response, tak si data uložíme do state  */
  useEffect(() => {
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  }, []);
  /* Reprezentuje přihlášeného uživatele */
  const [loggedUser, setLoggedUser] = useState();

  /* Jakmile dostaneme data ze serveru, tak se pokusíme najít v těchto datech uživatele, který je přihlášený podle ID.
     Kdo je přihlášený máme v localStorage uloženo jako ID.
     Proto mi projedeme data ze serveru a najdeme data toho, kdo má stejné ID jako náš přihlášený 
  */
  useEffect(() => {
    /* Ze začátku ovšem data mohou být nulová, a proto kontrolujeme, jestli už je máme nebo ne. Když data nemáme, tak přerušíme funkci. */
    if (dataFromRequest == null) return;
    /* Projedeme data ze serveru a najdeme přihlášeného uživatele a nastavíme ho */
    setLoggedUser(
      dataFromRequest.find(
        (zaznam) => zaznam.id === parseInt(localStorage.getItem("loggedUser"))
      )
    );
  }, [dataFromRequest]);

  /* Přihlášený uživatel - Protože uchováváme v loggedUser jenom ID, tak musíme poté procházet localStorage a hledat uživatele podle ID. */
  const checkUser = () => {
    console.log(parseInt(localStorage.getItem("loggedUser")));
    setLoggedUser(
      dataFromRequest.find(
        (zaznam) => zaznam.id === parseInt(localStorage.getItem("loggedUser"))
      )
    );
  };
  return (
    <div>
      <Header onClick={checkUser} />
      <hr />
      <div>
        <ListOfShoppingLists user={loggedUser} />
      </div>
    </div>
  );
}

export default Homepage;
