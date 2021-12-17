import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt-utill.js";
import rootModels from "../models/RootModels.js";
const userModel = rootModels.userModel();

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  const {
    body: { username, email, password },
  } = req;
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);
  const User = new userModel({
    name: username,
    email,
    password,
    createdAt: curr,
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
  userModel
    .findOne({ email })
    .then(async (r) => {
      console.log(r);
      if (!r) {
        return res.status(404).send({ status: 404, msg: "Email not found" });
      } else {
        const comparedPassword = await bcrypt.compare(
          password.toString(),
          r.password
        );
        if (comparedPassword) {
          const accessToken = jwt.sign({ username, email });

          return res.status(200).send({
            status: 200,
            msg: "Success signin",
            data: {
              email: r.email,
              username: r.name,
              createdAt: r.createdAt,
              accessToken,
              todos: r.todos,
              userId: r._id,
            },
          });
        } else {
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
