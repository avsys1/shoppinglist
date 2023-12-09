import "../css/global.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/listsOfLists.css";
import axios from "axios";
/**
 * Komponent profilu uživatele
 *
 * @returns
 */
function ListOfShoppingLists(props) {
  /* Aktuální vlastník seznamu */
  const [allLists, setAllLists] = useState();

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
          <h2 className="list_name">Shopping lists</h2>
          <div className="list-add-item">
            Add
            <button onClick={() => addList()} className="list-add-item-button">
              +
            </button>
          </div>
          <form>
            <p className="list-filter-heading"> Show </p>
            <div>
              <input
                name="filter"
                type="radio"
                checked={filter.state == 2 ? true : false}
                onChange={(e) => handleFilter(e, "All")}
              />
              All
            </div>
            <div>
              <input
                name="filter"
                type="radio"
                checked={filter.state == 1 ? true : false}
                onChange={(e) => handleFilter(e, "Archived")}
              />
              Archived
            </div>
          </form>
        </div>
      </div>
      <div>
        {allLists?.map((user) => {
          var list;
          if (filter.state == 1)
            list = user.lists.filter((list) => list.archived);
          if (filter.state == 2) list = user.lists;
          if (user.id === parseInt(localStorage.getItem("loggedUser"))) {
            return list.map((list) => (
              <div key={list.id} className="single-list">
                <Link to={"/list/" + user.id + "/" + list.id}>
                  {list.list_name}
                  <span className="single-list-owner">({user.name})</span>
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
                  <Link to={"/list/" + user.id + "/" + list.id}>
                    {list.list_name}
                    <span className="single-list-owner">({user.name})</span>
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
