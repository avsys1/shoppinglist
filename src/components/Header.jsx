import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";
/**
 * Header stránky
 */
function Header({ onClick }) {
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {dataFromRequest?.map((zaznam) => (
        <button
          className="btn btn-light"
          onClick={(e) => changeUser(zaznam.id)}
        >
          {zaznam.name}
        </button>
      ))}
    </nav>
  );
}

export default Header;
