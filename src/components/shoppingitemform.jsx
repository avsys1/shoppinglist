import axios from "axios";
import { useState } from "react";
function ShoppingItemForm(props) {
  const [name, setName] = useState();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="name"> Jméno </label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          name="name"
        />
        {name}
        <button type="submit">Odeslat</button>
      </form>
    </div>
  );
}

export default ShoppingItemForm;
