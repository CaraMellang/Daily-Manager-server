import express from "express";
import mongoose from "mongoose";
import { signUpUser } from "../models/SignupUser.js";
const userModel = signUpUser();
// const { default: axios } = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const email = username + "test@test.com";
  const currDate = new Date();
  console.log("사인업이에용", username, password);
  const User = new userModel({
    name: username,
    email,
    password,
    createdAt: currDate,
  });
  userModel.findOne({ email: email }).then((response) => {
    if (response != null) {
      console.log("이미 있는 이메일 입니다.");
      res.send({ status: false, message: "invailed email!" });
      throw Error("이미있습니다!");
    }
    try {
      User.save();
      console.log("저장완료");
      res.send({ status: true, message: "success" });
    } catch (e) {
      console.log("저장에러", e);
      res.send({ status: false, message: "save error" });
    }
  });
});

userRouter.post("/signin", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);

  const Cat = mongoose.model("Cat", { name: String, created: Date });
  // const kitty = new Cat({ name: "땅땅이입니다람쥐" });

  // kitty.save().then((r) => console.log("meow", r));

  Cat.findOne({ name: "땅땅이" }).then((r) => console.log("미야옹", r));
  res.send({ username: "헬로!!", createdAt: "1234" });
});

export default userRouter;
// module.exports = router;
