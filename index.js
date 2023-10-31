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
  console.log("Connected to MySQL database");
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
  
  const sqlVerify = "SELECT email FROM users WHERE email = ?";
  const valuesverify = [email];

  connection.query(sqlVerify, valuesverify, (err, result) => {
    if (err) throw err;
    console.log(result);

    if (result.length !== 0) {
      console.log("Erreur : Mail existe déjà");
      res.status(400).json({ message: "E-mail déjà existant" });
    } else {

      const sqlInsert =
        "INSERT INTO users (username, email, password, techno, gender) VALUES (?, ?, ?, ?, ?)";
      const values = [username, email, password, techno, gender];
      connection.query(sqlInsert, values, (err, result) => {
        if (err) throw err;

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
        res.status(200).json({ message: "OK" });
      });
    }
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);

  const {email, password} = req.body;
  
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) { throw error; }
    
    if (results.length > 0) {
      res.status(200).json({message : 'Bienvenue'});
    } else {
      res.status(200).json({message : 'Incorrect'});
    }
    
    connection.end();
  });
});

app.listen(port, () => {
  console.log(`Serveur connécté au port : ${port}`);
});
