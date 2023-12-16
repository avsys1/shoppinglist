import ShoppingList from "./components/ShoppingList.jsx";
import Homepage from "./components/Homepage.jsx";
import { Routes, Route } from "react-router-dom";
import { React } from "react";
import "./css/global.css";
import { useStyle } from "./context/StyleContext.jsx";
import Detail from "./components/Detail.jsx";

function App() {
  const { currentMode } = useStyle();
  return (
    <div id="content" className={"bg-" + currentMode}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/list/:user_id/:list_id" element={<ShoppingList />} />
        <Route path="/detail/:user_id/:list_id" element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;
