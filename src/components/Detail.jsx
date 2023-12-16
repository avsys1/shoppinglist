import "../css/global.css";
import Header from "./Header";
import { useEffect, useRef, useState } from "react";
import ListOfShoppingLists from "./ListOfShoppingLists";
import axios from "axios";
import { useStyle } from "../context/StyleContext";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { useParams } from "react-router-dom";

/**
 * Komponent domácí stránky
 *
 * @returns
 */

function Detail() {
  const [dataFromRequest, setDataFromRequest] = useState(null);
  const { currentMode } = useStyle();
  const [loading, setLoading] = useState(true);
  var { list_id } = useParams();
  var { user_id } = useParams();
  const data1 = useRef();
  const bought = useRef(0);
  const not_bought = useRef(0);
  const COLORS = ["#8884d8", "#82ca9d"];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
        </div>
      );
    }
    return null;
  };

  /* Při zapnutí stránky provede žádost o data ze serveru. Jakmile dostaneme response, tak si data uložíme do state  */
  useEffect(() => {
    axios
      .get("http://localhost:3001/single_list/stats", {
        params: {
          list_id,
          user_id,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data.items);
        data.items.forEach((zaznam) => {
          console.log(zaznam.bought == true);
          zaznam.bought == true
            ? (bought.current += 1)
            : (not_bought.current += 1);
        });
        console.log("test2");
        data1.current = [
          {
            name: "Koupené",
            value: bought.current,
          },
          {
            name: "Nekoupené",
            value: not_bought.current,
          },
        ];
        setLoading(false);
      })
      .catch((error) => {});
  }, []);
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

  /* Přihlášený uživatel - Protože uchováváme v loggedUser jenom ID, tak musíme poté procházet localStorage a hledat uživatele podle ID. */
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
  if (!loading)
    return (
      <div>
        <Header onClick={checkUser} />
        <hr />
        <div>
          <h1 style={{ textAlign: "center" }}> Statistiky </h1>
          <PieChart width={730} height={250}>
            <Pie
              data={data1.current}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={50}
              fill="#8884d8"
              label="Data"
            >
              {data1.current.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </div>
      </div>
    );
}

export default Detail;
