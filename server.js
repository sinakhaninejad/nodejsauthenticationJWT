require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());

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

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req);
  res.json(posts.filter((post) => post.name));
});

function authenticateToken(req, res, next) {
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
