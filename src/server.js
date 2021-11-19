import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.js";
import mongoose from "mongoose";
// const express = require("express");
// const cors = require("cors");
// const signIn = require("./routes/auth");
// const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const app = express();
const route = express.Router();

mongoose
  .connect("mongodb://localhost:27017/todo-app")
  .then((res) => {
    console.log("Connect!!");
  })
  .catch((e) => {
    console.log("ConnectError!");
  });

let corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

//Express 4.x버전부터 body-parser모듈 내장
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", cors(corsOption), userRouter);

const port = 5000; //노드 서버가 사용할 포트
app.listen(port, () => console.log(`Listening on port ${port}`));
