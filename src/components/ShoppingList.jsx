import React, { useEffect, useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap";
import Header from "./Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useStyle } from "../context/StyleContext";
import { useLang } from "../context/LangContext";

/**
 * Komponent nákupního seznamu
 * @param {*} props - Vlastnosti
 * @returns Komponent nákupního seznamu
 */
function ShoppingList(props) {
  /* Aktuální vlastník seznamu */
  var { list_id } = useParams();
  var { user_id } = useParams();
  const [data, setData] = useState(null);
  const [list, setList] = useState(null);
  const [listOwner, setListOwner] = useState(null);
  const { currentMode } = useStyle();
  const { texts } = useLang();

  async function getData() {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/list")
        .then((res) => {
          setData(res.data);
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

  useEffect(() => {
    if (data == null) return;
    setList(
      data
        .find((user) => user.id == user_id)
        .lists.find((list) => list.id == list_id)
    );
    setListOwner(data.find((user) => user.id == user_id));
    setProducts(
      data
        .find((user) => user.id == user_id)
        .lists.find((list) => list.id == list_id).items
    );
  }, [data]);
  const [products, setProducts] = useState();
  const [newItem, setNewItem] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState("");
  const [shouldEditName, setShouldEditName] = useState("");
  const [editedListName, setEditedListName] = useState("");
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    state: 0,
    name: texts.notfiltered,
  });

  useEffect(() => {
    setFilter({
      state: 0,
      name: texts.notfiltered,
    });
  }, [texts]);
  /* ID přihlášeného uživatele */
  const loggedUser = parseInt(localStorage.getItem("loggedUser"));

  /**
   * Zaškrtává nebo odškrtává položky
   * @param {*} productId Id produktu, který se přeškrtne
   */
  const handleProductToggle = (productId) => {
    async function toggleData() {
      const new_products = products.map((product) =>
        product.id == productId
          ? { ...product, bought: !product.bought }
          : product
      );
      return new Promise((resolve, reject) => {
        axios
          .patch("http://localhost:3001/single_list/item", {
            new_products,
            user_id,
            list_id,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    toggleData().catch((error) => {
      console.error("Error occured at inserting data on server", error.message);
    });
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  };

  /**
   * Přidá položku, která uložená jako newItem do listu
   */
  const handleAddItem = () => {
    /* Najde největší ID v poli (abychom dalšímu prvku mohli dát o jedno větší ID) */
    const maxIdObject = products.reduce((maxObject, currentObject) => {
      return currentObject.id > maxObject.id ? currentObject : maxObject;
    }, products[0]);

    if (newItem.trim() != "") {
      const newProduct = {
        id: maxIdObject.id + 1,
        name: newItem.trim(),
        bought: false,
        userId: user_id,
      };
      var new_products = [...products];
      new_products.push(newProduct);
      async function toggleData() {
        return new Promise((resolve, reject) => {
          axios
            .patch("http://localhost:3001/single_list/item", {
              new_products,
              user_id,
              list_id,
            })
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      toggleData().catch((error) => {
        console.error(
          "Error occured at inserting data on server",
          error.message
        );
      });
      getData().catch((error) => {
        console.error(
          "Error occured at fetching data from server",
          error.message
        );
      });
      setNewItem("");
    }
  };
  /**
   * Přejmenuje určitý produkt
   * @param {*} productId Id produktu
   */
  const handleEditItem = (productId) => {
    setEditItemId(productId);
    setEditedItem(
      products.find((product) => product.id == productId)?.name || ""
    );
  };
  /**
   * Uloží při změně jména nové jméno produktu
   */
  const handleSaveEdit = () => {
    const new_products = products.map((product) =>
      product.id == editItemId
        ? { ...product, name: editedItem.trim() }
        : product
    );
    if (editedItem.trim() != "") {
      async function toggleData() {
        return new Promise((resolve, reject) => {
          axios
            .patch("http://localhost:3001/single_list/item", {
              new_products,
              user_id,
              list_id,
            })

            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      toggleData().catch((error) => {
        console.error(
          "Error occured at insertion data on server",
          error.message
        );
      });
      getData().catch((error) => {
        console.error(
          "Error occured at fetching data from server",
          error.message
        );
      });
      setEditItemId(null);
      setEditedItem("");
    }
  };
  /**
   * Zruší přejmenování produktu
   */
  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditedItem("");
  };
  /**
   * Odebere prvek z listu
   * @param {*} productId - Id produktu
   */
  const handleDeleteItem = (productId) => {
    const new_products = products?.filter((product) => product.id != productId);
    async function toggleData() {
      return new Promise((resolve, reject) => {
        axios
          .patch("http://localhost:3001/single_list/item", {
            new_products,
            user_id,
            list_id,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    toggleData().catch((error) => {
      console.error("Error occured at insertion data on server", error.message);
    });
    getData().catch((error) => {
      console.error(
        "Error occured at fetching data from server",
        error.message
      );
    });
  };
  /**
   * Kontroluje filtrování podle stavu a nastavuje filtr
   */
  function handleFilter() {
    if (filter.state == 0)
      setFilter({
        state: 1,
        name: texts.toggled,
      });
    if (filter.state == 1)
      setFilter({
        state: 2,
        name: texts.untoggled,
      });
    if (filter.state == 2)
      setFilter({
        state: 0,
        name: texts.notfiltered,
      });
  }
  /**
   * Metoda na editaci jména
   */
  function editListName() {
    if (editedListName.trim() != "") {
      async function toggleData() {
        return new Promise((resolve, reject) => {
          axios
            .patch("http://localhost:3001/single_list/name", {
              list_name: editedListName,
              user_id,
              list_id,
            })
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      toggleData().catch((error) => {
        console.error(
          "Error occured at inserting data on server",
          error.message
        );
      });
      getData().catch((error) => {
        console.error(
          "Error occured at fetching data from server",
          error.message
        );
      });
    }
  }

  /**
   * Funkce na přidání uživatele do listu
   * @param {*} newUserId - Nové ID uživatele
   * @param {*} shouldRemove - true pro přidání, false pro odebrání
   */
  function operateUser(newUserId, shouldRemove) {
    data.forEach((zaznam) => {
      if (zaznam.id == user_id) {
        /* Jakmile ho najde, udělá si kopii */
        const newUserList =
          zaznam.lists[
            zaznam.lists.findIndex((zaznam) => (zaznam.id = list_id))
          ].addedUsersId;

        if (shouldRemove) {
          /* Pokud mám odstraňovat a uživatel v listu opravdu je, odeberu ho z kopie */
          if (newUserList.includes(newUserId))
            newUserList.splice(newUserList.indexOf(newUserId), 1);
        } else {
          /* Pokud mám přidávat a uživatel tam ještě není, přidám ho do kopie */
          if (!newUserList.includes(newUserId)) newUserList.push(newUserId);
        }
        /* A nakonec kopií nahradím originál */
        zaznam.addedUsersId = newUserList;
        async function toggleData() {
          return new Promise((resolve, reject) => {
            axios
              .patch("http://localhost:3001/single_list/users", {
                newUserList,
                user_id,
                list_id,
              })
              .then((response) => {
                resolve(response.data);
              })
              .catch((error) => {
                reject(error);
              });
          });
        }
        toggleData().catch((error) => {
          console.error(
            "Error occured at inserting data to server",
            error.message
          );
        });
        getData().catch((error) => {
          console.error(
            "Error occured at fetching data from server",
            error.message
          );
        });
      }
    });
  }
  /**
   * Metoda, která nechá uživatele odejít z nákupního listu
   */
  function handleLeaveUser() {
    /* Najdu v listu přidaných uživatelů IDčko, které patří lognutému uživateli. */
    if (list.addedUsersId.some((zaznam) => zaznam == loggedUser)) {
      /* Kopii odeberu z seznamu přidaných uživatelů uživatele, který klikl na tlačítko "Odejít" */

      const index = list.addedUsersId.indexOf(loggedUser);
      const new_list = list.addedUsersId
        .slice(0, index)
        .concat(list.addedUsersId.slice(index + 1));
      console.log(new_list);
      async function toggleData() {
        return new Promise((resolve, reject) => {
          axios
            .patch("http://localhost:3001/single_list/users", {
              newUserList: new_list,
              user_id: listOwner.id,
              list_id,
            })
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      toggleData().catch((error) => {
        console.error(
          "Error occured at inserting data to server",
          error.message
        );
      });
      getData().catch((error) => {
        console.error(
          "Error occured at fetching data from server",
          error.message
        );
      });
      navigate("/");
    }
  }
  return (
    <div>
      <Header />
      <hr />
      <div>
        <div className="list-name">
          <h2>{list?.list_name}</h2>{" "}
          <button style={{ width: "6.5rem" }}>
            <Link
              style={{
                fontSize: "1rem",
                textAlign: "start",
                display: "block",
                marginLeft: "0.5rem",
              }}
              to={"/detail/" + user_id + "/" + list_id}
            >
              {" "}
              Statistiky{" "}
            </Link>
          </button>
          {user_id == loggedUser ? (
            <div>
              {shouldEditName ? (
                <div>
                  <input
                    type="text"
                    onChange={(e) => setEditedListName(e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      editListName(false);
                    }}
                  >
                    {texts.save}
                  </button>
                  <button
                    onClick={(e) => {
                      setShouldEditName(false);
                    }}
                  >
                    {texts.close}
                  </button>
                </div>
              ) : (
                ""
              )}
              <button onClick={(e) => setShouldEditName(true)}>
                {" "}
                {texts.edit}{" "}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <button onClick={handleFilter}> {filter.name} </button>
        <ul>
          {products
            ?.filter((product) => {
              if (filter.state == 1) {
                return product.bought;
              } else if (filter.state == 2) {
                return !product.bought;
              } else {
                return true; // Výchozí stav - neuplatňovat filtr
              }
            })
            .map((product) => (
              <li
                key={product.id}
                style={{
                  textDecoration: product.bought ? "line-through" : "none",
                }}
              >
                {editItemId == product.id ? (
                  <>
                    <input
                      type="text"
                      value={editedItem}
                      onChange={(e) => setEditedItem(e.target.value)}
                    />
                    <button onClick={handleSaveEdit}>{texts.save}</button>
                    <button onClick={handleCancelEdit}>{texts.cancel}</button>
                  </>
                ) : (
                  <>
                    <span
                      className={
                        "list-filter-heading text-" +
                        (currentMode == "dark" ? "light" : "dark")
                      }
                      onClick={() => handleProductToggle(product.id)}
                    >
                      {product.name}
                    </span>
                    <button onClick={() => handleEditItem(product.id)}>
                      {texts.edit}
                    </button>
                    <button onClick={() => handleDeleteItem(product.id)}>
                      {texts.delete}
                    </button>
                  </>
                )}
              </li>
            ))}
        </ul>
        <div>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
          />
          <button onClick={handleAddItem}>{texts.add}</button>
        </div>
      </div>
      <hr />
      <div>
        {parseInt(user_id) == loggedUser ? (
          <div>
            <div>
              In list:
              {data?.map((zaznam, index) => {
                if (
                  list?.addedUsersId &&
                  list?.addedUsersId.includes(zaznam.id)
                )
                  return <h3> {zaznam.name}</h3>;
              })}
            </div>
            <div className="dropdowns">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Add User
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {data?.map((zaznam, index) => {
                    if (zaznam.id != user_id)
                      if (
                        !list?.addedUsersId.some(
                          (userId) => userId == zaznam.id
                        )
                      )
                        return (
                          <li
                            key={index}
                            onClick={(e) => operateUser(zaznam.id, false)}
                          >
                            <a className="dropdown-item" href="#">
                              {zaznam.name}
                            </a>
                          </li>
                        );
                  })}
                </ul>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Remove User
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {data?.map((zaznam, index) => {
                    if (zaznam.id != user_id)
                      if (
                        list?.addedUsersId.some((userId) => userId == zaznam.id)
                      )
                        return (
                          <li
                            key={index}
                            onClick={(e) => operateUser(zaznam.id, true)}
                          >
                            <a className="dropdown-item" href="#">
                              {zaznam.name}
                            </a>
                          </li>
                        );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          {loggedUser == user_id ? (
            ""
          ) : (
            <button onClick={(e) => handleLeaveUser()}> {texts.leave} </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
