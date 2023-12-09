import "../css/shoppingitem.css";
import { useState } from "react";
function ShoppingItem(props) {
  const [isFinished, setIsFinished] = useState();
  const id = props.id;

  function callRemove() {
    props.remove(id);
  }
  return (
    <div className="item">
      <h2>{props.name}</h2>
      <form>
        <input type="checkbox"></input>
      </form>
      <span>{props.id}</span>
      <button onClick={callRemove}> Odebrat </button>
    </div>
  );
}

export default ShoppingItem;
