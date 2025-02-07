"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");
const authConfig = require("../config/auth");
const router = express.Router();

router.post("/login", async (req, res) => {
  let file = path.join(__dirname, "../database/users.json");
  const { email, password } = req.body;
  try {
    fs.readFile(file, "utf8", (error, data) => {
      let users = JSON.parse(data);
      let user = _.find(users, { email: email, password: password });

      if (!user) return res.status(400).send({ error: "User not found" });

      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 3600 // Tempo de validade do token
      });

      return res.send({ name: user.name, email: user.email, token });
    });
  } catch (error) {
    return res.status(401).send({ error: "Erro ao fazer o login" });
  }
});

router.get("/logout", authMiddleware, function(req, res) {
  res.status(200).redirect("/");
});
module.exports = app => app.use("/api", router);
