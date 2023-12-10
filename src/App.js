import ShoppingList from "./components/ShoppingList.jsx";
import Homepage from "./components/Homepage.jsx";
import { Routes, Route } from "react-router-dom";
import { React, Fragment } from "react";
import "./css/global.css";
import { useStyle } from "./context/StyleContext.jsx";

function App() {
  const { currentMode, setCurrentMode } = useStyle();
  return (
    <div id="content" className={"bg-" + currentMode}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/list/:user_id/:list_id" element={<ShoppingList />} />
      </Routes>
    </div>
  );
}

export default App;
