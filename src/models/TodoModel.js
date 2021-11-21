import mongoose from "mongoose";
import todoSchema from "../schema/Todo.js";

const todoModel = () => {
  todoSchema.pre("update", function (next) {});
  return mongoose.model("todos", todoSchema);
};

export default todoModel;
