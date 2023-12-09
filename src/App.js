import ShoppingList from "./components/ShoppingList.jsx";
import Homepage from "./components/Homepage.jsx";
import { Routes, Route } from "react-router-dom";
import { React, Fragment } from "react";
import "./css/global.css";
function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/list/:user_id/:list_id" element={<ShoppingList />} />
      </Routes>
    </Fragment>
  );
}

export default App;
