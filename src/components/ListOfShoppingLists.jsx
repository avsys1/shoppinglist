import "../css/global.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/listsOfLists.css";
import axios from "axios";
import { useLang } from "../context/LangContext";
import { useStyle } from "../context/StyleContext";
/**
 * Komponent profilu uživatele
 *
 * @returns
 */
function ListOfShoppingLists(props) {
  /* Aktuální vlastník seznamu */
  const [allLists, setAllLists] = useState(null);
  const { currentMode } = useStyle();
  const { lang, texts } = useLang();
  const [allListsCount, setAllListsCount] = useState(0);
  const [allItemsCount, setAllItemsCount] = useState(0);
  async function getData() {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/list")
        .then((res) => {
          setAllLists(res.data);
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  useEffect(() => {
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  }, []);
  /* ID přihlášeného uživatele */
  const loggedUser = parseInt(localStorage.getItem("loggedUser"));

  const [listOwner, setListOwner] = useState(props.user);
  const [filter, setFilter] = useState({
    state: 2,
    name: "All",
  });

  useEffect(() => {
    if (allLists == null) return;
    var all_counts_lists = 0;
    var all_counts_item = 0;
    allLists?.map((user) => {
      if (user.id === parseInt(localStorage.getItem("loggedUser"))) {
        all_counts_lists += user.lists.length;

        user.lists.forEach((list) => (all_counts_item += list.items.length));
      }
      user.lists.map((list) => {
        if (
          list.addedUsersId.includes(
            parseInt(localStorage.getItem("loggedUser"))
          )
        ) {
          all_counts_item += list.items.length;
          all_counts_lists++;
        }
      });
    });
    setAllListsCount(all_counts_lists);
    setAllItemsCount(all_counts_item);
  }, [allLists, parseInt(localStorage.getItem("loggedUser"))]);

  /**
   * Kontroluje filtrování podle stavu a nastavuje filtr
   */
  function handleFilter(value, filter) {
    if (filter === "Archived")
      setFilter({
        state: 1,
        name: "Archived",
      });
    if (filter == "All")
      setFilter({
        state: 2,
        name: "All",
      });
  }
  /**
   * Funkce na nastavení listu jako archivovaného
   */
  function handleChangeArchived(list_id) {
    async function archiveData() {
      return new Promise((resolve, reject) => {
        axios
          .patch("http://localhost:3001/single_list/archived", {
            list_id,
            loggedUser,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    archiveData().catch((error) => {
      console.error("Error occured at sending data to server", error.message);
    });
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  }
  /**
   * Smaže určitý list podle ID
   * @param {*} list_id - Id listu, který se bude mazat
   */
  function deleteList(list_id) {
    async function deleteData() {
      return new Promise((resolve, reject) => {
        axios
          .delete("http://localhost:3001/single_list", {
            params: {
              id: list_id,
              loggedUser,
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    deleteData().catch((error) => {
      console.error("Error occured at deleting data", error.message);
    });
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  }

  /**
   * Přidám list uživateli
   */
  function addList() {
    return new Promise((resolve, reject) => {
      async function deleteData() {
        await axios
          .post("http://localhost:3001/single_list", {
            loggedUser,
          })

          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      }
      deleteData().catch((error) => {
        console.error("Error occured at deleting data", error.message);
      });
      getData().catch((error) => {
        console.error(
          "Error occured at fetching data from server",
          error.message
        );
      });
    });
  }
  return (
    <div>
      <div>
        <div className="list_menu">
          <h2
            className={
              "list_name text-" + (currentMode == "dark" ? "light" : "dark")
            }
          >
            {texts.shoppingLists}
          </h2>
          <div className="list-add-item">
            {texts.add}
            <button onClick={() => addList()} className="list-add-item-button">
              +
            </button>
          </div>
          <form>
            <p
              className={
                "list-filter-heading text-" +
                (currentMode == "dark" ? "light" : "dark")
              }
            >
              {" "}
              Show{" "}
            </p>
            <div>
              <input
                name="filter"
                type="radio"
                checked={filter.state == 2 ? true : false}
                onChange={(e) => handleFilter(e, "All")}
              />
              <span
                className={
                  "list-filter-heading text-" +
                  (currentMode == "dark" ? "light" : "dark")
                }
              >
                {texts.All}
              </span>
            </div>
            <div>
              <input
                name="filter"
                type="radio"
                checked={filter.state == 1 ? true : false}
                onChange={(e) => handleFilter(e, "Archived")}
              />
              <span
                className={
                  "list-filter-heading text-" +
                  (currentMode == "dark" ? "light" : "dark")
                }
              >
                {texts.archived}
              </span>
            </div>
          </form>
        </div>
      </div>
      <h2>
        Počet nákupních seznamů:
        {allListsCount}
      </h2>
      <h2> Počet položek v seznamech: {allItemsCount}</h2>
      <div>
        {allLists?.map((user) => {
          var list;
          if (filter.state == 1)
            list = user.lists.filter((list) => list.archived);
          if (filter.state == 2) list = user.lists;
          if (user.id === parseInt(localStorage.getItem("loggedUser"))) {
            return list.map((list) => (
              <div key={list.id} className="single-list">
                <Link
                  className={
                    "text-" + (currentMode == "dark" ? "light" : "dark")
                  }
                  to={"/list/" + user.id + "/" + list.id}
                >
                  {list.list_name}
                  <span
                    className={
                      "single-list-owner text-" +
                      (currentMode == "dark" ? "light" : "dark")
                    }
                  >
                    ({user.name})
                  </span>
                </Link>
                <div className="single-list-actions">
                  <div className="single-list-action">
                    <span className="single-list-action-heading">Delete</span>
                    <button
                      className="single-list-action-button"
                      onClick={(e) => deleteList(list.id)}
                    >
                      -
                    </button>
                  </div>
                  <div className="single-list-action">
                    <span className="single-list-action-heading">Archive</span>
                    <input
                      type="checkbox"
                      onChange={() => handleChangeArchived(list.id)}
                      className="single-list-action-button"
                      checked={list.archived ? list.archived : false}
                    />
                  </div>
                </div>
              </div>
            ));
          }
          return null;
        })}
        {allLists?.map((user) => {
          var all_lists;
          if (filter.state == 1)
            all_lists = user.lists.filter((list) => list.archived);
          if (filter.state == 2) all_lists = user.lists;
          return all_lists.map((list) => {
            if (list.addedUsersId.includes(parseInt(loggedUser))) {
              return (
                <div key={list.id} className="single-list">
                  <Link
                    className={
                      "text-" + (currentMode == "dark" ? "light" : "dark")
                    }
                    to={"/list/" + user.id + "/" + list.id}
                  >
                    {list.list_name}
                    <span
                      className={
                        "single-list-owner text-" +
                        (currentMode == "dark" ? "light" : "dark")
                      }
                    >
                      ({user.name})
                    </span>
                  </Link>
                </div>
              );
            }
            return null;
          });
        })}
      </div>
    </div>
  );
}

export default ListOfShoppingLists;
