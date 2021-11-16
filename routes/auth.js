// import express from "express";
const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

router.post("/signup", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);
  res.send({ username: "헬로!!", createdAt: "123" });
});

router.post("/signin", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);

  const Cat = mongoose.model("Cat", { name: String });

  const kitty = new Cat({ name: "땅땅이" });
  kitty.save().then((r) => console.log("meow", r));
  res.send({ username: "헬로!!", createdAt: "123" });
});

// export default router;
module.exports = router;
