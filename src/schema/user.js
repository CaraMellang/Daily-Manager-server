import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  createdAt: { type: Date },
});
