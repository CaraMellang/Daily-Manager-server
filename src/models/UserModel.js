import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "../schema/user.js";

const saltRounds = 8; //salt 돌리는 횟수.(hasing 랜덤하게)

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const userModel = () => {
  userSchema.pre("save", function (next) {
    //arrow function 지원안함 ㅋㅋ 엌ㅋㅋㅋ
    const user = this; //userSchema를 가리킴

    if (user.isModified("password")) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
          if (err) return next(err);
          user.password = hashedPassword; //성공하면 바꿈.
          next(); //해싱 끝나면 다음으로(save)
        });
      });
    } else {
      next(); //바로save로감? 아닌듯 => 2021.11.18일 추가) 몽구즈의 미들웨어라서 save전에 실행되기에 next를 써줘야함.
    }
  });

  return mongoose.model("users", userSchema);
};

export default userModel;
