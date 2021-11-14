// import express from "express";
// import cors from "cors";
const express = require("express");
const cors = require("cors");
const signIn = require("./routes/auth");

const app = express();
const route = express.Router();

let corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

//Express 4.x버전에는 body-parser모듈 내장
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", cors(corsOption), signIn);

const port = 5000; //노드 서버가 사용할 포트
app.listen(port, () => console.log(`Listening on port ${port}`));
