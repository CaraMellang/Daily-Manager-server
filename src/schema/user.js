import Mongoose from "mongoose";

export const userSchema = new Mongoose.Schema({
  _id: {
    type: Mongoose.Types.ObjectId,
    default: new Mongoose.Types.ObjectId(),
  },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  // todos: [{ type: Mongoose.Types.ObjectId, ref: "todos" }],
  createdAt: { type: Date },
});
