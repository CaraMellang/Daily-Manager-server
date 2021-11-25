import Mongoose from "mongoose";

export const userSchema = new Mongoose.Schema({
  // _id: {
  //   type: Mongoose.Types.ObjectId,
  //   default: new Mongoose.Types.ObjectId(),
  // },
  name: { type: String },
  email: {
    type: String,
    required: true,
    // match: /.+\@.+@..+/, //email 패턴이 아니면 저장 X => 수정필요
  },
  password: { type: String },
  // todos: [
  //   {
  //     _id: false,
  //     todoId: {
  //       type: Mongoose.Types.ObjectId,
  //       unique: true,
  //       index: true,
  //       required: true,
  //       ref: "todos",
  //     },
  //     todo: { type: String },
  //   },
  // ],보류, 나중에 필요하면 건들여보자
  // todos: [{ type: Mongoose.Types.ObjectId, ref: "todos" }],
  createdAt: { type: Date, default: null },
});
