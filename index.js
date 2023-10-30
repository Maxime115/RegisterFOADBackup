const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const port = 8000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "formlesson",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/addUser", (req, res) => {
  console.log(req.body);
  const { username, email, password, techno, gender, hobbies } = req.body;
  const sqlInsert =
    "INSERT INTO users (username, email, password, techno, gender) VALUES (?, ?, ?, ?, ?)";
  // on stocke les valeurs qui vont remplacer les ?
  const values = [username, email, password, techno, gender];
  connection.query(sqlInsert, values, (err, result) => {
    if (err) throw err;
    console.log(result);
    let idUser = result.insertId;
    let insertHobby =
      "INSERT INTO hobbies (hobby, level, idUser) VALUES (?, ?, ?)";
    hobbies.map((hobby, index) => {
      connection.query(
        insertHobby,
        [hobby.value, hobby.level, idUser],
        (err, result) => {
          if (err) throw err;
        }
      );
    });
    res.status(200).json({ message: "Ok" });
  });
});

app.listen(port, () => {
  console.log(`Serveur Node écoutant sur le port${port}`);
});
