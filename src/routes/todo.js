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
      console.log("유저 오브젝트 아이디", r._id.toString());
      //   new Mongoose.Types.ObjectId()
      const date = new Date();
      const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
      const curr = new Date(utc);
      const Todo = new todoModel({
        creatorId: r._id,
        todo,
        createdAt: curr,
      });
      Todo.save().then((rr) => {
        // userModel
        //   .updateOne(
        //     { _id: r._id },
        //     { $push: { todos: { todoId: rr._id, todo: rr.todo } } }
        //   )
        //   .then((asd) => {
        //     console.log("실행왈료", asd);
        //   })
        //   .catch((ee) => console.log("ㅇ이ㅣ이잉", ee));
        todoModel
          .findOne({ _id: rr._id })
          .populate("creatorId")
          .then((rss) => {
            console.log("사랑해", rss);
          }) //참조 완료!!
          .catch((pope) => console.log("사랑하는데 에레양", pope));
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

todoRouter.get("/read", function (req, res, next) {
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
      console.log(`배열길이 ${r.length}`);
      console.log("아이아잉", r[0].createdAt);
      console.log("아이아잉", r[0].createdAt.getUTCDay());

      res.status(200).send({ status: 200, msg: "찾기 완료", data: r });
    })
    .catch((e) => {
      console.log("read.find 파인드에러", e);
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
      // console.log(rr);
      const dataArray = [];
      rr.forEach((arr) => {
        if (arr.createdAt.getUTCMonth() + 1 === month) {
          console.log(typeof arr.createdAt);
          dataArray.push(arr);
        }
      });
      console.log("dataArray", dataArray);
      return res
        .status(200)
        .send({ status: 200, msg: "완료띠", data: dataArray });
    })
    .catch((e) => {
      console.log(e);
      return res.status(404).send({ status: 400, msg: "Oh 에리임 아무튼에러" });
    });
  // res.status(200).send({ status: 200, msg: "gg" });
});

todoRouter.patch("/updatetodo", function (req, res, next) {
  const {
    body: { token, todoId, todo },
  } = req;

  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }

  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
  const curr = new Date(utc);

  todoModel
    .updateOne({ _id: todoId }, { $set: { todo: todo, updatedAt: curr } })
    .then((r) => {
      console.log("실행완료", r);
      res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log("에러", e);
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
      console.log("실행완료", r);
      res
        .status(200)
        .send({ status: 200, msg: "성공적으로 업데이트 하였습니다", data: r });
    })
    .catch((e) => {
      console.log("에러", e);
    });
});

todoRouter.delete("/delete", function (req, res, next) {
  const {
    body: { token, todoId },
  } = req;

  const result = jwt.verify(token);
  if (!result.ok) {
    res.status(401).send({ status: 401, msg: result.message });
  }
  todoModel
    .deleteOne({ _id: todoId })
    .then((r) => {
      console.log("삭제완료");
      res
        .status(200)
        .send({ status: 200, msg: "삭제 완료되었습니다", data: r });
    })
    .catch((e) => {
      console.log("error", e);
      next();
    });
});

export default todoRouter;
