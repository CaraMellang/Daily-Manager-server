import Mongoose from "mongoose";

const date = new Date();
const utc = date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000;
const curr = new Date(utc)
// console.log(utc);
// console.log("utc", new Date(utc));
// console.log("getDaye", new Date(utc).getUTCHours());

const todoSchema = new Mongoose.Schema({
  creatorId: { type: Mongoose.Types.ObjectId, ref: "users" },
  todo: { type: String },
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: curr },
  updatedAt: { type: Date, default: null },
});

export default todoSchema;
