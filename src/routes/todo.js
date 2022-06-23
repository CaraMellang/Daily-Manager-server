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
    body: { todo },
  } = req;

  const splitArray = req.headers[`authorization`].split(` `);
  const token = splitArray[1];
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
      let curr;
      if (process.env.NODE_ENV === "development") {
        curr = new Date();
      } else {
        const date = new Date();
        const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
        curr = new Date(utc);
      }

      const Todo = new todoModel({
        creatorId: r._id,
        todo,
        createdAt: curr,
        updatedAt: null,
      });
      Todo.save().then((rr) => {
        return res.status(200).send({ data: rr, msg: "완료" });
      });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).send({ status: 500, msg: "오류", e });
    });
});

todoRouter.post("/read", function (req, res, next) {
  const {
    body: { userId },
  } = req;
  const splitArray = req.headers[`authorization`].split(` `);
  const access_token = splitArray[1];

  const result = jwt.verify(access_token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }
  todoModel
    .find({ creatorId: userId })
    .populate({ path: "creatorId", select: ["_id", "email", "name"] })
    .then((r) => {
      return res.status(200).send({ status: 200, msg: "찾기 완료", data: r });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).send({ status: 500, msg: "오류", e });
    });
});

todoRouter.post("/findcurrmonth", function (req, res, next) {
  const {
    body: { userId, year, month, date },
  } = req;
  const newDate = new Date();
  const utc = newDate.getTime() + newDate.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);
  curr.setUTCMonth(month + 1);
  todoModel
    .find({ creatorId: userId })
    .then((rr) => {
      const dataArray = [];
      rr.forEach((arr) => {
        if (arr.createdAt.getUTCMonth() + 1 === month) {
          dataArray.push(arr);
        }
      });
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
    body: { todoId, todo, success },
  } = req;
  const splitArray = req.headers[`authorization`].split(` `);
  const access_token = splitArray[1];
  const result = jwt.verify(access_token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }

  let curr;
  if (process.env.NODE_ENV === "development") {
    curr = new Date();
  } else {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
    curr = new Date(utc);
  }

  todoModel
    .updateOne(
      { _id: todoId },
      { $set: { todo: todo, success: success, updatedAt: curr } }
    )
    .then((r) => {
      return res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).send({ status: 500, msg: "오류", e });
    });
});

todoRouter.patch(`/updatesuc`, function (req, res, next) {
  const {
    body: { todoId, success },
  } = req;

  const splitArray = req.headers[`authorization`].split(` `);
  const access_token = splitArray[1];
  const result = jwt.verify(access_token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }

  let curr;
  if (process.env.NODE_ENV === "development") {
    curr = new Date();
  } else {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
    curr = new Date(utc);
  }

  todoModel
    .updateOne(
      { _id: todoId },
      { $set: { success: !success, updatedAt: curr } }
    )
    .then((r) => {
      return res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).send({ status: 500, msg: "오류", e });
    });
});

todoRouter.delete("/delete", function (req, res, next) {
  const {
    body: { todoId },
  } = req;

  const splitArray = req.headers[`authorization`].split(` `);
  const access_token = splitArray[1];
  const result = jwt.verify(access_token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  } else {
    todoModel
      .deleteOne({ _id: todoId })
      .then((r) => {
        return res
          .status(200)
          .send({ status: 200, msg: "삭제 완료되었습니다", data: r });
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).send({ status: 500, msg: "오류", e });
      });
  }
});

export default todoRouter;
