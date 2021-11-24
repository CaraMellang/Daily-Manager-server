import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt-utill.js";
import rootModels from "../models/RootModels.js";
const userModel = rootModels.userModel();
// const { default: axios } = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  const {
    body: { username, email, password },
  } = req;
  // const email = username + "test@test.com";
  const currDate = new Date();
  console.log("사인업이에용", username, password);
  const User = new userModel({
    name: username,
    email,
    password,
    createdAt: currDate,
  });
  userModel
    .findOne({ email: email })
    .then((response) => {
      if (response != null) {
        console.log("이미 있는 이메일 입니다.");
        res.status(400).send({ status: 400, message: "invailed email!" });
        throw Error("이미있습니다!");
      }
      try {
        User.save();
        console.log("저장완료");
        res.status(200).send({ status: 200, message: "success" });
      } catch (e) {
        console.log("저장에러", e);
        res.status(403).send({ status: false, message: "save error" });
      }
    })
    .catch((e) => {
      console.log("사인업 findOne Error", e);
    });
});

userRouter.post("/signin", (req, res, next) => {
  const {
    body: { username, email, password },
  } = req;
  console.log("사인인", email, username, password);
  userModel
    .findOne({ email })
    .then(async (r) => {
      console.log(r);
      if (!r) {
        console.log("없어임마");
        return res.status(404).send({ status: 404, msg: "Email not found" });
      } else {
        const comparedPassword = await bcrypt.compare(
          password.toString(),
          r.password
        );
        console.log("컴페어 패스워트", comparedPassword);
        if (comparedPassword) {
          console.log("완료단");
          const accessToken = jwt.sign({ username, email });

          return res.status(200).send({
            status: 200,
            msg: "Success signin",
            data: {
              username: r.name,
              createdAt: r.createdAt,
              accessToken,
              todos: r.todos,
              userId: r._id,
            },
          });
        } else {
          console.log("노일치");
          return res
            .status(401)
            .send({ status: 401, msg: "Passwords do not match." });
        }
      }
    })
    .catch((e) => {
      console.log(e);
      next();
    });
  // console.log(userEmail);
  // if (!userEmail) {
  //   return res.send({ status: 404, message: "Email not found!!" });
  //   next();
  // } else {
  //   console.log("ㅎㅇ");
  // }

  // const comparedPassword = await bcrypt.compare(
  //   password.toString(),
  //   userEmail.password
  // );
  // console.log("컴페어 패스워트", comparedPassword);
  // if (comparedPassword) {
  //   return res.send({ status: 200, message: "로그인완료" });
  // } else {
  //   return res.send({ status: 404, message: "아이디가 일치하지 않습니다." });
  // }

  // const Cat = mongoose.model("Cat", { name: String, created: Date });
  // // const kitty = new Cat({ name: "땅땅이입니다람쥐" });

  // // kitty.save().then((r) => console.log("meow", r));

  // Cat.findOne({ name: "땅땅이" }).then((r) => console.log("미야옹", r));
});

userRouter.post("/verify", function (req, res, next) {
  const splitArray = req.headers.authorization.split(` `);
  const token = splitArray[1];
  console.log(splitArray[1]);
  const result = jwt.verify(token);
  if (result.ok) {
    res.status(200).send({
      status: 200,
      msg: "Signin Success",
      data: { email: result.email, username: result.username },
    });
  } else {
    res.status(401).send({ status: 401, msg: result.message });
  }
  console.log(result);
});
export default userRouter;
// module.exports = router;
