import express from "express";
import mongoose from "mongoose";

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

export const signUpUser = (name, email, password) => {
  const currDate = new Date();
  const UserModel = mongoose.model("users", {
    name: String,
    email: String,
    password: String,
    createdAt: Date,
  });
  UserModel.findOne({ email: email }).then((res) => {
    if (res !== null) {
      console.log("이미 있는 아이디 입니다.");
      return;
    }
    const User = new UserModel({ name, email, password, createdAt: currDate });

    User.save().then(() => console.log("유저 저장완료"));
  });
};
