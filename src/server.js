import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.js";
import mongoose from "mongoose";
import todoRouter from "./routes/todo.js";
import dotenv from "dotenv";
dotenv.config(); //.env 사용
// const express = require("express");
// const cors = require("cors");
// const signIn = require("./routes/auth");
// const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const app = express();
const route = express.Router();

const mongoUrl = process.env.DBURL;
// const mongoUrl ="mongodb://localhost:27017/todo-app";
console.log(mongoUrl);

mongoose
  .connect(mongoUrl)
  .then((res) => {
    console.log("Connect!!");
  })
  .catch((e) => {
    console.log("ConnectError!", e);
  });

let corsOption = {
  origin: ["http://localhost:3000", `https://project-dm.netlify.app/`],
  optionsSuccessStatus: 200,
};
app.use(cors());

//Express 4.x버전부터 body-parser모듈 내장
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRouter);
app.use("/todo", todoRouter);

const port = process.env.PORT || 5000; //노드 서버가 사용할 포트
app.listen(port, () => console.log(`Listening on port ${port}`));

