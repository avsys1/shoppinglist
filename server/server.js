const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3001;
const app = express();
var mock_data = require("../server/mock-data/mockData.json");
const fs = require("fs");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function updateData(json_data) {
  fs.writeFile(
    "../server/mock-data/mockData.json",
    JSON.stringify(json_data),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}
app.get("/list", (req, res) => {
  //return res.status(400).send();
  res.send(mock_data);
});

app.patch("/single_list/archived", (req, res) => {
  /* Najdu uživatele, který je přihlášený. V jeho seznamech najdu seznam, který má id podle toho, které jsme zaškrtli.
    Tomu seznamu změním archived na opačnou hodnotu -> Z true na false, z false na true */
  mock_data
    .find((user) => user.id == req?.body?.loggedUser)
    .lists.find((list) => list.id == req?.body?.list_id).archived = !mock_data
    .find((user) => user.id == req?.body?.loggedUser)
    .lists.find((list) => list.id == req?.body?.list_id).archived;

  updateData(mock_data);
  res.status(200).send("Succesfully archived");
});
app.delete("/single_list", (req, res) => {
  /* Najdu uživatelovi seznamy a odeberu z nich patřičný seznam pomocí metody array.splice. 
    Ta vezme jako první index v poli a počet prvků, které má odebrat (1) */
  mock_data
    .find((user) => user.id == req?.query?.loggedUser)
    .lists.splice(
      mock_data
        .find((user) => user.id == req?.query?.loggedUser)
        .lists.findIndex((list) => list.id == req?.query?.id),
      1
    );
  updateData(mock_data);
  res.status(200).send("Succesfully deleted");
});
app.post("/single_list", (req, res) => {
  var mock_data_max_id = mock_data.find(
    (user) => user.id == req?.body?.loggedUser
  ).lists_id;

  /* Vložím nový defaulní list pomocí metody array.push */
  mock_data
    .find((user) => user.id == req?.body?.loggedUser)
    .lists.push({
      id: mock_data_max_id,
      list_name: "My first List " + mock_data_max_id,
      archived: false,
      addedUsersId: [],
      items: [
        { id: 1, name: "Apple", bought: false },
        { id: 2, name: "Banana", bought: false },
        { id: 3, name: "Orange", bought: true },
      ],
    });
  /* Přičtu max_id + 1, jak je zmíněno nahoře */
  mock_data.find((user) => user.id == req?.body?.loggedUser).lists_id += 1;
  updateData(mock_data);
  res.send("Successfully added");
});
app.patch("/single_list/item", (req, res) => {
  mock_data
    .find((user) => user.id == req?.body?.user_id)
    .lists.find((list) => list.id == req?.body?.list_id).items =
    req?.body?.new_products;
  updateData(mock_data);
  return res.sendStatus(200);
});
app.patch("/single_list/name", (req, res) => {
  mock_data
    .find((user) => user.id == req?.body?.user_id)
    .lists.find((list) => list.id == req?.body?.list_id).list_name =
    req?.body?.list_name;
  updateData(mock_data);
  return res.sendStatus(200);
});
app.patch("/single_list/users", (req, res) => {
  mock_data
    .find((user) => user.id == req?.body?.user_id)
    .lists.find((list) => list.id == req?.body?.list_id).addedUsersId =
    req?.body?.newUserList;
  updateData(mock_data);
  return res.sendStatus(200);
});
/* Spuštění serveru */
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
