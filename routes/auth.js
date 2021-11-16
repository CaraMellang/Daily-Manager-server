import express from "express";
import mongoose from "mongoose";
// const { default: axios } = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");

const userRouter = express.Router();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

userRouter.post("/signup", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);
  res.send({ username: "헬로!!", createdAt: "123" });
});

userRouter.post("/signin", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);

  const Cat = mongoose.model("Cat", { name: String });
  // const kitty = new Cat({ name: "땅땅이입니다람쥐" });

  // kitty.save().then((r) => console.log("meow", r));

  Cat.findOne({ name: "땅땅이입니다람쥐" }).then((r) =>
    console.log("미야옹", r)
  );
  res.send({ username: "헬로!!", createdAt: "1234" });
});

export default userRouter;
// module.exports = router;
