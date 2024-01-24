require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());

app.use(express.json());

const users = [];

const posts = [
  {
    name: "sina",
    titile: "post1",
  },
  {
    name: "amin",
    titile: "post2",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/posts", authenticateToken, (req, res) => {
  console.log("h1111111");
  // res.json(posts => posts.name === );
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (e) {
    res.status(500);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    console.log("cannot find user");
    return res.status(404).send("cannot find user");
  }

  if (await bcrypt.compare(req.body.password, user.password)) {
    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  } else {
    res.status(500).json({ error: "somthing went wrong" });
  }
});

function authenticateToken(req, res, next) {
  console.log("login verified");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}

app.listen(3000);

//await bcrypt.compare(req.body.password, user.password)
