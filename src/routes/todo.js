import express from "express";
import Mongoose from "mongoose";
import jwt from "../utils/jwt-utill.js";
import dayjs from "dayjs";
import RootModels from "../models/RootModels.js";

const userModel = RootModels.userModel();

const todoModel = RootModels.todoModel();
const todoRouter = express.Router();

todoRouter.post("/create", function (req, res, next) {
  const {
    body: { token, todo },
  } = req;
  let email = "";
  const result = jwt.verify(token);
  if (result.ok) {
    email = result.email;
  } else {
    res.status(401).send({ status: 401, msg: result.message });
  }
  userModel
    .findOne({ email })
    .then((r) => {
      const date = new Date();
      const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
      const curr = new Date(utc);
      const Todo = new todoModel({
        creatorId: r._id,
        todo,
        createdAt: curr,
      });
      Todo.save().then((rr) => {
        todoModel
          .findOne({ _id: rr._id })
          .populate("creatorId")
          .then((rss) => {
            console.log("사랑해", rss);
          }) //참조 완료!!
          .catch((e) => console.log(e));
        res.status(200).send({ data: rr, msg: "완료" });
        next();
      });
    })
    .catch((e) => {
      console.log(e);
    });
  //   const Todo = new todoModel({
  //     creator,
  //     todo,
  //   });
  //   Todo.save().then((r) => {
  //     console.log(r);
  //     res.send(r);
  //   });
});

todoRouter.post("/read", function (req, res, next) {
  const {
    body: { token, userId },
  } = req;

  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }
  todoModel
    .find({ creatorId: userId })
    .populate("creatorId")
    .then((r) => {

      res.status(200).send({ status: 200, msg: "찾기 완료", data: r });
    })
    .catch((e) => {
      console.log( e);
    });
});

todoRouter.post("/findcurrmonth", function (req, res, next) {
  const {
    body: { userId, year, month, date },
  } = req;

  const newDate = new Date();
  const utc = newDate.getTime() + newDate.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);
  console.log("curr", curr, month);
  curr.setUTCMonth(month + 1);
  console.log("curr", curr);
  console.log("아니", userId, year, curr.getUTCMonth(), month, date);
  todoModel
    .find({ creatorId: userId })
    .then((rr) => {
      const dataArray = [];
      rr.forEach((arr) => {
        if (arr.createdAt.getUTCMonth() + 1 === month) {
          dataArray.push(arr);
        }
      });
      console.log("dataArray", dataArray);
      return res
        .status(200)
        .send({ status: 200, msg: "완료", data: dataArray });
    })
    .catch((e) => {
      console.log(e);
      return res.status(404).send({ status: 400, msg: "에러" });
    });
});

todoRouter.patch("/updatetodo", function (req, res, next) {
  const {
    body: { token, todoId, todo, success },
  } = req;
  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }

  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);

  todoModel
    .updateOne(
      { _id: todoId },
      { $set: { todo: todo, success: success, updatedAt: curr } }
    )
    .then((r) => {
      res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log(e);
    });
});

todoRouter.patch(`/updatesuc`, function (req, res, next) {
  const {
    body: { token, todoId, success },
  } = req;
  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }

  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);
  todoModel
    .updateOne(
      { _id: todoId },
      { $set: { success: !success, updatedAt: curr } }
    )
    .then((r) => {
      res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log(e);
    });
});

todoRouter.delete("/delete", function (req, res, next) {
  const {
    body: { token, todoId },
  } = req;

  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  } else {
    todoModel
      .deleteOne({ _id: todoId })
      .then((r) => {
        res
          .status(200)
          .send({ status: 200, msg: "삭제 완료되었습니다", data: r });
      })
      .catch((e) => {
        console.log(e);
        next();
      });
  }
});

export default todoRouter;
