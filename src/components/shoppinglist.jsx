import ShoppingItemForm from "./shoppingitemform";
import ShoppingItem from "./shoppingitem";
import { useState, useRef, useCallback } from "react";

function ShoppingList() {
  const [allShopItems, setAllShopItems] = useState([]);
  const nameOfitem = useRef();
  const id = useRef(0);

  const removeItem = useCallback((idToRemove) => {
    setAllShopItems((prevItems) => {
      // Použijeme aktuální stav `prevItems` k odstranění položky z nákupního seznamu
      return prevItems.filter((objekt) => objekt.props.id !== idToRemove);
    });
  }, []); // Prázdné pole závislostí, pouze při inicializaci komponenty

  return (
    <div>
      <h1>Shopping List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          var field_of_current_shopping_items = [...allShopItems];
          field_of_current_shopping_items.push(
            <ShoppingItem
              name={nameOfitem.current.value}
              id={id.current}
              remove={removeItem}
            ></ShoppingItem>
          );

          console.log(id.current);
          id.current = parseFloat(id.current) + 1;
          setAllShopItems(field_of_current_shopping_items);
          console.log(allShopItems);
        }}
      >
        <label htmlFor="name"> Jméno </label>
        <input ref={nameOfitem} />
        <button type="submit">Odeslat</button>
      </form>
      {allShopItems}
    </div>
  );
}

export default ShoppingList;
