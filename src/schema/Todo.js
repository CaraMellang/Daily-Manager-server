import Mongoose from "mongoose";

const todoSchema = new Mongoose.Schema({
  creator: { type: Mongoose.Types.ObjectId, ref: "users" },
  todo: { type: String },
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default todoSchema;
