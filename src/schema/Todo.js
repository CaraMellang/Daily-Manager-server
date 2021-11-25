import Mongoose from "mongoose";

const todoSchema = new Mongoose.Schema({
  creatorId: { type: Mongoose.Types.ObjectId, ref: "users" },
  todo: { type: String },
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
});

export default todoSchema;
